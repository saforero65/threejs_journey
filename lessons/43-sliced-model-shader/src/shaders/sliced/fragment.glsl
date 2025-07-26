
varying vec3 vPosition;

uniform float uSliceStart; // Start of the slice
uniform float uSliceArc; // Arc length of the slice


void main(){

    float angle = atan(vPosition.y, vPosition.x);
    angle -= uSliceStart; // Adjust angle based on the slice start
    angle = mod(angle,PI2);

    if(angle > 0.0 && angle < uSliceArc) discard;

    float csm_Slice;
  
}