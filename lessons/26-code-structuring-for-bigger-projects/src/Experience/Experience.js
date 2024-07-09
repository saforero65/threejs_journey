import * as THREE from 'three';
import Camera from "./Camera";
import Renderer from './Renderer';
import sources from './sources';
import Debug from './Utils/Debug';
import Resources from './Utils/Resources';
import Sizes from "./Utils/Sizes";
import Time from "./Utils/Time";
import World from './World/World';

let instance = null;

export default class Experience {
    constructor(canvas)
    {
        //Singleton
        if(instance)
            return instance;

        instance = this;

        //Global acces
        window.experience = this;

        //Options
        this.canvas = canvas;
        
        //Setup
        this.debug = new Debug();
        this.sizes = new Sizes();
        this.time = new Time();
        this.scene = new THREE.Scene();
        this.resources = new Resources(sources);
        this.camera = new Camera()
        this.renderer = new Renderer();
        this.world = new World();
        
        this.sizes.on('resize', this.resize.bind(this));
        this.time.on('tick', this.update.bind(this));
    }

    resize(){
        this.camera.resize();
        this.renderer.resize();
    }

    update(){
        this.camera.update();
        this.world.update();
        this.renderer.update();
    }

    destroy(){
        this.sizes.off('resize');
        this.time.off('tick');

        //Traverse the whole scene
        this.scene.traverse((child) => {
            if(child instanceof THREE.Mesh)
            {
                child.geometry.dispose();

                for(const key in child.material)
                {
                    const value = child.material[key];

                    if(value && value.dispose === 'function') value.dispose();
                }
                
            }
        });

        this.camera.controls.dispose();
        this.renderer.instance.dispose();

        if(this.debug) this.debug.gui.destroy();

    }

}