// Various classes to help with abstraction of parts of the program

// Provides an abstraction for any type of buffer
// gl: webgl context
// type: type of buffer, used when binding
// data: the data for the buffer
// mode: gl mode e.g. static draw
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

// Provides abstraction for vertex/colour data and buffers
// gl: webgl context
// type: buffer type
// data: buffer data
// mode: gl mode e.g. static draw
// name: name of attrib in shader
// program: webgl program
class VertexAttrib extends Buffer {
    constructor(gl, type, data, mode, name, program) {  
        super(gl, type, data, mode);
        this.name = name;
        this.program = program;
        this.location = this.gl.getAttribLocation(this.program, this.name); 
    }
    
    // Binds and tells webgl how to use data
    // num: number of components
    // type: gl type of vertices
    // normalise: normalise data?
    // stride: amount of elements to skip each time
    // offset: offset of data
    use(num, type, normalise, stride, offset) {
        this.bind();
        this.gl.vertexAttribPointer(this.location, num, type, normalise, stride, offset);
        this.gl.enableVertexAttribArray(this.location);
    }
}

class Item {
    constructor(gl, program, ) {

    }
}

// Provides an abstraction for a matrix
// gl: webgl context
// program: program variable
// name: name of the uniform in the shader
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

// Provides abstraction for a shader
// gl: webgl context
// type: vertex/shader
// src: shader source in text
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
 
// Provides abstraction for a program
// gl: webgl context
// vertSrc: source for vertex shader
// fragSrc: source for fragment shader
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
