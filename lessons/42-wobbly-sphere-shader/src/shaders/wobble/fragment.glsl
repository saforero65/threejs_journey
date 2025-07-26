uniform vec3 uColorA;
uniform vec3 uColorB;

varying float vWobble;  

void main(){
    //  csm_DiffuseColor.rgb = vec3(vUv, 1.0);
    // csm_Metalness = sin(vUv.x * 100.0);
    // csm_Roughness = 1.0 - csm_Metalness;
    float colorMix = smoothstep(-1.0, 1.0, vWobble);
    csm_DiffuseColor.rgb = mix(uColorA, uColorB, colorMix);

    //Shiinny tip
    csm_Roughness = 1.0 - colorMix;
    

}