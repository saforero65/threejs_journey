import EventEmitter from "./EventEmitter";

export default class Sizes extends EventEmitter {
    constructor(){
        super();
        //Setup
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.pixelRatio = Math.min(window.devicePixelRatio, 2); //Get the pixel ratio of the device (for retina displays) and cap it at 2 (2 is the maximum pixel ratio)

        //Resize event
        window.addEventListener('resize', () =>
        {
            //Update sizes
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.pixelRatio = Math.min(window.devicePixelRatio, 2); 

            this.trigger('resize');
        });

    }
}