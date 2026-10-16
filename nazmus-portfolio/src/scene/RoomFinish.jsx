import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";

import {
  PMREMGenerator,
  WebGLRenderTarget,
  HalfFloatType,
} from "three";

import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { SSAOPass } from "three/addons/postprocessing/SSAOPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

export default function RoomFinish() {
  const { gl, scene, camera, size, viewport } = useThree();
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

    const width = Math.max(size.width, 1);
    const height = Math.max(size.height, 1);
    const isMobile = width < 700;

    const target = new WebGLRenderTarget(width, height, {
      type: HalfFloatType,
      samples: Math.min(4, gl.capabilities.maxSamples),
    });

    const composer = new EffectComposer(gl, target);
    composer.setPixelRatio(Math.min(gl.getPixelRatio(), 1.25));
    composer.setSize(width, height);

    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    let ao = null;
    if (!isMobile) {
      ao = new SSAOPass(scene, camera, width, height, 8);
      ao.kernelRadius = 0.14;
      ao.minDistance = 0.001;
      ao.maxDistance = 0.05;
      composer.addPass(ao);
    }

    const output = new OutputPass();
    composer.addPass(output);

    pipeline.current = composer;

    return () => {
      pipeline.current = null;

      scene.environment = previousEnvironment;
      scene.environmentIntensity = previousIntensity;

      ao?.dispose();
      output.dispose();
      composer.dispose();
      target.dispose();
      environment.dispose();
    };
  }, [gl, scene, camera]);

  useEffect(() => {
    if (!pipeline.current) return;

    pipeline.current.setPixelRatio(
      Math.min(gl.getPixelRatio(), 1.25)
    );
    pipeline.current.setSize(size.width, size.height);
  }, [gl, size.width, size.height, viewport.dpr]);

  useFrame((_, delta) => {
    if (pipeline.current) {
      pipeline.current.render(delta);
    } else {
      gl.render(scene, camera);
    }
  }, 1);

  return null;
}