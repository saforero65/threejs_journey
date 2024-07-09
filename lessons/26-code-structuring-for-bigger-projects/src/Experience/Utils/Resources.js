import { CubeTextureLoader, TextureLoader } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import EventEmitter from "./EventEmitter";

export default class Resources extends EventEmitter {

    constructor(sources)
    {
        super();

        //Options
        this.sources = sources;

        //Setup
        this.items = {};
        this.toLoad = this.sources.length;
        this.loaded = 0;

        this.setLoaders();
        this.startLoadings();
    }

    setLoaders(){
        this.loaders = {}
        this.loaders.gltfLoader = new GLTFLoader();
        this.loaders.textureLoader = new TextureLoader();
        this.loaders.cubeTextureLoader = new CubeTextureLoader();
    }

    startLoadings(){
        console.log(this.sources);
        this.sources.forEach(source => {
            console.log(source);
            this.loadItem(source);
        });
    }

    loadItem(source) {
        const onLoad = (file) => this.sourceLoaded(source, file);

        switch (source.type) {
            case 'gltfModel':
                this.loaders.gltfLoader.load(source.path, onLoad, undefined, (error) => console.error(error));
                break;
            case 'texture':
                this.loaders.textureLoader.load(source.path, onLoad, undefined, (error) => console.error(error));
                break;
            case 'cubeTexture':
                this.loaders.cubeTextureLoader.load(source.path, onLoad, undefined, (error) => console.error(error));
                break;
            default:
                console.warn(`Unknown source type: ${source.type}`);
        }
    }

    sourceLoaded(source, file){
        this.items[source.name] = file;
        this.loaded++;

        if(this.loaded === this.toLoad){
            this.trigger('ready', this.items);
        }

    }

  
}