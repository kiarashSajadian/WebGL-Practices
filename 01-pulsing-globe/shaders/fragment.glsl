uniform float time;
uniform sampler2D uTexture;

varying float pulse;
varying vec2 vUv;
varying vec3 vNormal;


void main() {
    vec4 myimage = texture(
        uTexture,
        vUv + 0.1*sin(vUv*20. + time));

    float sinePulse = (10.+sin(vUv.x*5. - time))*0.1;

    // gl_FragColor = vec4(vUv,0.,1.0);
    gl_FragColor = vec4(sinePulse,0.,0.,1.0);
    // gl_FragColor = myimage;
    gl_FragColor = vec4(0.8*(pulse+0.6),0.2,0.15,0.2);
} 