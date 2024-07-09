import * as THREE from 'three';
import Experience from "../Experience";

export default class Environment
{
    constructor()
    {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.time = this.experience.time;
        this.debug = this.experience.debug;

        //Debug
        if(this.debug)
        {
            this.debugFolder = this.debug.gui.addFolder('Environment');
            this.debugFolder.open();
        }

        //Setup
        this.setSunLight();
        this.setEnvironmentMap();

    }

    setSunLight(){
        // this.sunLight = new THREE.DirectionalLight(0xffffff, 1);
        // this.sunLight.position.set(0, 2, 0);
        // this.sunLight.castShadow = true;
        // this.sunLight.shadow.mapSize.width = 1024;
        // this.sunLight.shadow.mapSize.height = 1024;
        // this.sunLight.shadow.camera.far = 15;
        // this.sunLight.shadow.camera.left = - 7;
        // this.sunLight.shadow.camera.right = 7;
        // this.sunLight.shadow.camera.top = 7;
        // this.sunLight.shadow.camera.bottom = - 7;
        // this.scene.add(this.sunLight);

        // this.sunLightHelper = new THREE.CameraHelper(this.sunLight.shadow.camera);
        // this.scene.add(this.sunLightHelper);

        this.sunLight = new THREE.DirectionalLight('#ffffff', 4);
        this.sunLight.castShadow = true;
        this.sunLight.shadow.camera.far = 15;
        this.sunLight.shadow.mapSize.set(1024, 1024);
        this.sunLight.shadow.normalBias = 0.05;
        this.sunLight.position.set(3.5, 2, - 1.25);
        this.scene.add(this.sunLight);

        if(this.debug.active)
        {
            this.debugFolder.add(this.sunLight, 'intensity').min(0).max(10).step(0.001).name('sunLightIntensity');
            this.debugFolder.add(this.sunLight.position, 'x').min(- 5).max(5).step(0.001).name('x');
            this.debugFolder.add(this.sunLight.position, 'y').min(- 5).max(5).step(0.001).name('y');
            this.debugFolder.add(this.sunLight.position, 'z').min(- 5).max(5).step(0.001).name('z');
        }

      
    }

    setEnvironmentMap(){
        this.environmentMap = {}
        this.environmentMap.intensity = .4;
        this.environmentMap.texture = this.resources.items.environmentMapTexture;
        this.environmentMap.texture.colorSpace = THREE.SRGBColorSpace

        this.scene.environment = this.environmentMap.texture;

        this.environmentMap.updateMaterial = () =>
        {
            this.scene.traverse(child =>
            {
                if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
                {
                    child.material.envMap = this.environmentMap.texture;
                    child.material.envMapIntensity = this.environmentMap.intensity;
                    child.material.needsUpdate = true;
                }
            });
        }

        this.environmentMap.updateMaterial();

        if(this.debug.active)
        {
            this.debugFolder.add(this.environmentMap, 'intensity').name('envMapIntensity').min(0).max(4).step(0.001).onChange(this.environmentMap.updateMaterial);
        }
    }
}