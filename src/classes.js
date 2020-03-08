
class UniformMatrix {
    constructor(gl, program, name) {
      this.name = name;
      this.gl = gl;
  
      this.location = this.gl.getUniformLocation(program, name);
    }
  
    setData(data) {
      this.gl.uniformMatrix4fv(this.location, false, data);
    }
} 
  
class Buffer {
  constructor(gl, type, data, mode) {
    this.gl = gl;
    this.type = type;
    this.mode = mode;
  
    this.buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.type, this.buffer);      
    this.gl.bufferData(this.type, data, mode);
  }
  
  bind() {
    this.gl.bindBuffer(this.type, this.buffer);
  }
  
  setData(data) {
    this.gl.bufferData(this.type, data, this.mode);
  }
}
  
class Shader {
  constructor(gl, type, src) {
    this.gl = gl;
    this.shader = this.gl.createShader(type);
    this.gl.shaderSource(this.shader, src);
    this.gl.compileShader(this.shader);
    if (!gl.getShaderParameter(this.shader, gl.COMPILE_STATUS)) this.delete();
  }

  delete() {
    console.log(this.gl.getShaderInfoLog(this.shader));
    this.gl.deleteShader(this.shader);
  }
}
  
class Program {
  constructor(gl, vertSrc, fragSrc) {
    this.gl = gl;
    this.program = this.gl.createProgram();
    this.vert = new Shader(this.gl, this.gl.VERTEX_SHADER, vertSrc);
    this.frag = new Shader(this.gl, this.gl.FRAGMENT_SHADER, fragSrc);
    this.gl.attachShader(this.program, this.vert.shader);
    this.gl.attachShader(this.program, this.frag.shader);
    this.gl.linkProgram(this.program); 
  }
}
