import React, { useRef, useEffect } from 'react';
import { mat4, vec3 } from 'gl-matrix';
import { BlockDefinition, BlockModel, Identifier, ItemModel, ItemRendererResources, NbtCompound, NbtTag, Resources, Structure, StructureRenderer, TextureAtlas, UV, jsonToNbt, upperPowerOfTwo } from "deepslate";


interface StructureViewerProps {
    width?: number;
    height?: number;
    structure?: NbtCompound
}

const StructureViewer: React.FC<StructureViewerProps> = ({ width = 600, height = 400, structure }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const rendererRef = useRef<StructureRenderer | null>(null);
    const animationRef = useRef<number>();



    useEffect(() => {
        async function load() {
            const resources: (Resources & ItemRendererResources) = await loadResources();

            if (!canvasRef.current) return;
            if (!structure) return;
            if (!resources) return;
            const canvas = canvasRef.current;
            const gl = canvas.getContext('webgl');
            if (!gl) return;

            // --- Structure exemple ---
            const structureObj = Structure.fromNbt(structure!)

            // --- Renderer ---
            const renderer = new StructureRenderer(gl, structureObj, resources);
            rendererRef.current = renderer;

            // --- Fonctions utilitaires ---
            const computeDistance = (dimensions: [number, number, number], aspect: number) => {
                const [dx, dy, dz] = dimensions;
                const radius = Math.sqrt(dx * dx + dy * dy + dz * dz) / 2;
                const factor = aspect < 1 ? 3.0 : 2.5; // portrait vs paysage
                return radius * factor * 0.7;
            };

            const computeOrbitView = (dimensions: [number, number, number], angle: number, canvas: HTMLCanvasElement) => {
                const [dx, dy, dz] = dimensions;
                const center: vec3 = vec3.fromValues(dx / 2, dy / 2, dz / 2);
                const aspect = canvas.width / canvas.height;
                const distance = computeDistance(dimensions, aspect);

                const eye: vec3 = vec3.fromValues(
                    center[0] + Math.cos(angle) * distance,
                    center[1] + distance * 0.5,
                    center[2] + Math.sin(angle) * distance
                );
                const up: vec3 = vec3.fromValues(0, 1, 0);

                const view = mat4.create();
                mat4.lookAt(view, eye, center, up);
                return view;
            };


            // --- Animation orbit ---
            let angle = 0;
            const renderLoop = () => {
                angle += 0.01;
                const view = computeOrbitView(structureObj.getSize(), angle, canvas);

                renderer.drawStructure(view);


                animationRef.current = requestAnimationFrame(renderLoop);
            };
            renderLoop();

            return () => {
                cancelAnimationFrame(animationRef.current!);
                // window.removeEventListener('resize', resizeCanvas);
                rendererRef.current = null;
            };
        }

        async function loadResources() {
            const MCMETA = 'https://raw.githubusercontent.com/misode/mcmeta/'

            const [, blockstates, models, item_models, item_components, uvMap, atlas] = await Promise.all([
                fetch(`${MCMETA}registries/item/data.min.json`).then(r => r.json()),
                fetch(`${MCMETA}summary/assets/block_definition/data.min.json`).then(r => r.json()),
                fetch(`${MCMETA}summary/assets/model/data.min.json`).then(r => r.json()),
                fetch(`${MCMETA}summary/assets/item_definition/data.min.json`).then(r => r.json()),
                fetch(`${MCMETA}summary/item_components/data.min.json`).then(r => r.json()),
                fetch(`${MCMETA}atlas/all/data.min.json`).then(r => r.json()),
                new Promise<HTMLImageElement>(res => {
                    const image = new Image()
                    image.crossOrigin = 'Anonymous'
                    image.onload = () => res(image)
                    image.src = `${MCMETA}atlas/all/atlas.png`
                }),
            ]);

            // === Block Definitions ===
            const blockDefinitions: Record<string, BlockDefinition> = {}
            Object.keys(blockstates).forEach(id => {
                blockDefinitions['minecraft:' + id] = BlockDefinition.fromJson(blockstates[id])
            })

            // === Block Models ===
            const blockModels: Record<string, BlockModel> = {}
            Object.keys(models).forEach(id => {
                blockModels['minecraft:' + id] = BlockModel.fromJson(models[id])
            })
            Object.values(blockModels).forEach((m: any) =>
                m.flatten({ getBlockModel: (id: any) => blockModels[id] })
            )

            // === Item Models ===
            const itemModels: Record<string, ItemModel> = {}
            Object.keys(item_models).forEach(id => {
                itemModels['minecraft:' + id] = ItemModel.fromJson(item_models[id].model)
            })

            // === Item Components ===
            const itemComponents: Record<string, Map<string, NbtTag>> = {}
            Object.keys(item_components).forEach(id => {
                const components = new Map<string, NbtTag>()
                Object.keys(item_components[id]).forEach(c_id => {
                    components.set(c_id, jsonToNbt(item_components[id][c_id]))
                })
                itemComponents['minecraft:' + id] = components
            })

            // === Texture Atlas ===
            const atlasCanvas = document.createElement('canvas')
            const atlasSize = upperPowerOfTwo(Math.max(atlas.width, atlas.height))
            atlasCanvas.width = atlasSize
            atlasCanvas.height = atlasSize
            const atlasCtx = atlasCanvas.getContext('2d')!
            atlasCtx.drawImage(atlas, 0, 0)
            const atlasData = atlasCtx.getImageData(0, 0, atlasSize, atlasSize)

            const idMap: Record<string, UV> = {}
            Object.keys(uvMap).forEach((id: string) => {
                const [u, v, du, dv] = uvMap[id]
                const dv2 = du !== dv && id.startsWith('block/') ? du : dv
                idMap[Identifier.create(id).toString()] = [
                    u / atlasSize,
                    v / atlasSize,
                    (u + du) / atlasSize,
                    (v + dv2) / atlasSize,
                ]
            })
            const textureAtlas = new TextureAtlas(atlasData, idMap)

            // === Resources Object ===
            const resources: Resources & ItemRendererResources = {
                getBlockDefinition(id: Identifier) { return blockDefinitions[id.toString()] },
                getBlockModel(id: Identifier) { return blockModels[id.toString()] },
                getTextureUV(id: Identifier) { return textureAtlas.getTextureUV(id) },
                getTextureAtlas() { return textureAtlas.getTextureAtlas() },
                getPixelSize() { return textureAtlas.getPixelSize() },
                getBlockFlags(id: Identifier) { return { opaque: false } },
                getBlockProperties(id: Identifier) { return null },
                getDefaultBlockProperties(id: Identifier) { return null },
                getItemModel(id: Identifier) { return itemModels[id.toString()] },
                getItemComponents(id: Identifier) { return itemComponents[id.toString()] },
            }

            return resources
        }

        load()

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <canvas ref={canvasRef} width={1000} height={500} style={{ width: '100%', border: '1px solid white' }} />;
};

export default StructureViewer;
