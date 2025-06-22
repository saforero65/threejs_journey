uniform vec3 uColor;
uniform vec2 uResolution;
uniform float uShadowRepetitions;
uniform vec3 uShadowColor;
uniform float uLightRepetitions;
uniform vec3 uLightColor;

varying vec3 vNormal;
varying vec3 vPosition;

#include ../includes/ambientLight.glsl
#include ../includes/directionalLight.glsl
#include ../includes/pointLight.glsl

vec3 halftone(vec3 color, float repetitions, vec3 direction, float low, float high, vec3 pointColor, vec3 normal
) {
     float intensity = dot(normal, direction); // Intensity based on normal and direction
    intensity = smoothstep(low, high, intensity); // Smooth transition for halftone effect

    vec2 uv = gl_FragCoord.xy / uResolution.y;
    uv *=  repetitions; // Scale UV coordinates for halftone effect
    uv = mod(uv, 1.0); // Create a grid pattern

    float point = distance(uv, vec2(0.5)); // Distance from the center of the halftone point
    point = 1.0 - step(0.5*intensity, point); // Create a binary halftone effect

    color = mix(color, pointColor, point); // Mix the color with the halftone point color based on intensity
    
    return color;
}

void main()
{
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);
    vec3 color = uColor;

    // Lights
    vec3 light = vec3(0.0);
    light += ambientLight(
        vec3(1.0), // Ambient color
        1.0 // Ambient intensity
    );

    light += directionalLight(
        vec3(1.0), // Directional light color
        1.0, // Directional light intensity
        normal,
        vec3(1.0, 1.0, 0.0), // Light direction
        viewDirection, // View direction
        1.0 // Shadow bias
    );

    color *= light;

    // Halftone
    color = halftone(
        color,
        uShadowRepetitions, // repetitions
        vec3(0.0, -1.0, 0.0), // direction
        -0.8, // low
        1.5, // high
        uShadowColor, // point color
        normal
    );

       color = halftone(
        color,
        uShadowRepetitions, // repetitions
        vec3(0.0, -1.0, 0.0), // direction
        -0.8, // low
        1.5, // high
        uShadowColor, // point color
        normal
    );

    color = halftone(
        color,
        uLightRepetitions, // repetitions
        vec3(1.0, 1.0, 0.0), // direction
        0.5, // low
        1.5, // high
        uLightColor, // point color
        normal
    );

    // Final color
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}