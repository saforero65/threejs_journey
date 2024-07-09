import EventEmitter from "./EventEmitter";

export default class Time extends EventEmitter {
    constructor(){
        super();

        //Setup
        this.start = Date.now();
        this.current = this.start;
        this.elapsed = 0;
        this.delta = 16;

        //Tick
        this.tick();

    }

    tick(){
        const currentTime = Date.now();
        this.delta = currentTime - this.current; //Time between the current frame and the previous frame
        this.current = currentTime; //Time at the beginning of the current frame
        this.elapsed = currentTime - this.start; //Time elapsed since the start of the application

        this.trigger('tick');

        window.requestAnimationFrame(this.tick.bind(this));
    }
}