uniform vec3 uColor;

varying vec3 vNormal;
varying vec3 vPosition;

#include ../includes/ambientLight.glsl
#include ../includes/directionalLight.glsl
#include ../includes/pointLight.glsl

void main()
{
    // Normalizing the normal
    vec3 normal = normalize(vNormal);
    vec3 viewDIrection = normalize(vPosition -  cameraPosition);
    vec3 color = uColor;

    //Light 
    vec3 light = vec3(0.0);
    // light += ambientLight(
    //     vec3(1.0),               // Light color
    //     0.03                                   // Intensity
    // );
    light += directionalLight(
        vec3(0.1, 0.1, 1.0),         // Light color
        1.0,                                    // Intensity
        normal,                                 // Normal
        vec3(0.0, 0.0, 3.0),          // Light position
        viewDIrection,                          // View direction
        20.0                                    // Specular power
    );
    light += pointLight(
        vec3(1.0, 0.1, 0.1),         // Light color
        1.0,                                    // Intensity
        normal,                                 // Normal
        vec3(0.0, 2.5, 0.0),          // Light position
        viewDIrection,                          // View direction
        20.0,                                   // Specular power
        vPosition,                               // Position
        0.3                                     // Light decay
    );

    color *= light;

    // Final color
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}