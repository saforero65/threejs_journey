import * as THREE from 'three';
import Experience from "./Experience";

export default class Renderer
{
    constructor()
    {
        this.experience = new Experience();

        this.canvas = this.experience.canvas;
        this.scene = this.experience.scene;
        this.camera = this.experience.camera;
        this.sizes = this.experience.sizes;
        this.time = this.experience.time;

        this.setInstance();
    }

    setInstance(){
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
        });

        this.instance.physicallyCorrectLights = true;
        this.instance.outputEncoding = THREE.sRGBEncoding;
        this.instance.toneMapping = THREE.CineonToneMapping;
        this.instance.toneMappingExposure = 1.75;
        this.instance.shadowMap.enabled = true;
        this.instance.shadowMap.type = THREE.PCFSoftShadowMap;
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(this.sizes.pixelRatio);
        this.instance.setClearColor(0x121212, 1);
    }

    resize(){
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(this.sizes.pixelRatio);
    }

    update(){
        this.instance.render(this.scene, this.camera.instance);
    }
}