
# 04.Transform Objects

## Introduction

Now that we have everything in place, we can explore Three.js functionalities.

Before animating our scene, we need to know how to transform objects in our scene. We've already done that with the camera by moving it backward using the  `camera.position.z = 3`.

There are 4 properties to transform objects in our scene

- position (to move the object)
- scale (to resize the object)
- rotation (to rotate the object)
- quaternion (to also rotate the object; more about that later)

All classes that inherit from the `Object3D` class possess those properties like `PerspectiveCamera` or `Mesh` and classes that we haven't covered yet.

You can see from what classes inherit each class on top of the Three.js documentation.

Those properties will be compiled in what we call matrices. Matrices are used internally by Three.js, by the WebGL, and by the GPU to transform things. Fortunately, you don't have to handle matrices by yourself and you can just modify the previously-mentioned properties.
