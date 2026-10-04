import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PMREMGenerator } from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { SSAOPass } from "three/addons/postprocessing/SSAOPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

export default function RoomFinish() {
  const { gl, scene, camera, size } = useThree();
  const pipeline = useRef(null);

  useEffect(() => {
    const previousEnvironment = scene.environment;
    const previousIntensity = scene.environmentIntensity;

    const generator = new PMREMGenerator(gl);
    const studio = new RoomEnvironment();
    const environment = generator.fromScene(studio, 0.04);

    scene.environment = environment.texture;
    scene.environmentIntensity = 0.35;

    studio.dispose();
    generator.dispose();

    const composer = new EffectComposer(gl);
    const ao = new SSAOPass(scene, camera, 1, 1, 16);

    ao.kernelRadius = 0.22;
    ao.minDistance = 0.001;
    ao.maxDistance = 0.07;

    const output = new OutputPass();

    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(ao);
    composer.addPass(output);

    pipeline.current = composer;

    return () => {
      pipeline.current = null;

      scene.environment = previousEnvironment;
      scene.environmentIntensity = previousIntensity;

      ao.dispose();
      output.dispose();
      composer.dispose();
      environment.dispose();
    };
  }, [gl, scene, camera]);

  useEffect(() => {
    if (!pipeline.current) return;

    pipeline.current.setPixelRatio(
      Math.min(gl.getPixelRatio(), 1.5)
    );
    pipeline.current.setSize(size.width, size.height);
  }, [gl, size.width, size.height]);

  useFrame((_, delta) => {
    if (pipeline.current) {
      pipeline.current.render(delta);
    } else {
      gl.render(scene, camera);
    }
  }, 1);

  return null;
}