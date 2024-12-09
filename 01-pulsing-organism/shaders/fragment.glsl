uniform float time;
uniform sampler2D uTexture;
uniform vec3 uColor;

varying float pulse;
varying vec2 vUv;
varying vec3 vNormal;

void main() {
   vec4 myimage = texture(
       uTexture,
       vUv + 0.1*sin(vUv*20. + time));

   float sinePulse = (10.+sin(vUv.x*5. - time))*0.1;

   gl_FragColor = vec4(uColor * (pulse+0.4), 0.2);
}