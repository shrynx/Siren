PGraphics pg;

PShape ph;
PShader ps;

void setup() {
<<<<<<< HEAD
  size(800, 600, P3D);
  //fullScreen(P3D, 2);
=======
  fullScreen(P3D, 2);
>>>>>>> origin/development
  pg = createGraphics(width,height, P3D);

  ph = createSphere();
  ps = loadShader("main/sphereFrag.glsl", "main/sphereVert.glsl");

  /* start oscP5, listening for incoming messages at port 12000
     IP = 127.0.0.1 */
  oscP5 = new OscP5(this, 12000);

  initFilters();
  initShaders();
}

void draw() {
  background(20);

  updateUniforms_Filters();
  updateUniforms_Shaders();

  // Main object drawn
  drawShaders();
  drawSphere();

  // post-processing effects
  presets();
  glitchFx();
  strobeFx();
  randomMasksFx();
  toggleFilters();

  // Overall subtle line pattern
  filter(lines);

  //saveFrame("C:\\GitHub\\200c\\celluar\\im-######.tga");

  // Debugging texts
  /*fill(255);
  textSize(25);
  text(frameRate, 5, 30);*/
}