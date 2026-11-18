import type { PrismaClient } from "@prisma/client";

export const selectedProjects = [
  {
    slug: "hum",
    name: "hum",
    blurb: "Music starts before the studio.",
    live: "https://hum.thepushh.com",
    code: "https://github.com/the-pushh/hum-2-music",
    order: 11,
    tags: JSON.stringify(["Next.js","React","TypeScript","Spotify Basic Pitch","TensorFlow.js","Tone.js","smplr","Dexie","Web Audio"]),
    content: `What if capturing a musical idea were as effortless as humming it?

Most musical ideas don’t begin in a DAW. They appear while walking, improvising, or doing something completely unrelated. By the time you’ve opened a project, selected an instrument, and set up a track, that initial idea might already be gone.

I built hum, a browser-based musical sketchpad that lets you hum melodies, beatbox rhythms, and collect lyrics before developing them into something more complete.

## The experience

Record a melody and watch its pitch appear as you sing. The recording becomes a musical sketch with detected notes, key, tempo, and editable timing.

You can clean up the notes, quantize them to a rhythmic grid, change instruments, or open the idea in a lightweight studio with a piano roll, drum sequencer, and generated accompaniment.

When you’re happy with an idea, export MIDI or audio and continue working in Logic, Ableton, GarageBand, or another DAW.

## Engineering highlights

- Real-time pitch visualization and browser-based audio recording
- Melody transcription, key detection, and rhythmic quantization
- Touch-friendly piano roll with drag, resize, and note editing
- Chord, bass, and drum accompaniment with selectable musical styles
- Browser-side persistence using IndexedDB
- MIDI export and rendered audio with instrument samples
- Offline playback after instrument samples have been cached

## The idea behind it

I wanted the first interaction to feel closer to making music than operating music software.

The interesting challenge wasn’t simply extracting notes from audio. It was connecting an informal musical gesture to something structured and editable without making the experience feel technical.`,
  },
  {
    slug: "traffic-simulator",
    name: "Traffic Simulator",
    blurb: "A city you can rearrange.",
    live: "https://traffic-sim-one.vercel.app",
    code: "https://github.com/the-pushh/traffic-sim",
    order: 10,
    tags: JSON.stringify(["Three.js","TypeScript","Vite","Vitest","Playwright"]),
    content: `What happens when traffic becomes something you can touch, manipulate, and experiment with?

Traffic systems are complicated. A single signal change can improve one road while creating a bottleneck somewhere else.

I built an interactive 3D traffic simulator where people can construct road networks, observe individual vehicles, experiment with traffic controls, and see the consequences of their decisions.

## The experience

The simulation takes place on a navigable 3D board. You can orbit around the city, zoom in, inspect vehicles, and modify the road network directly.

Drag roads, junctions, roundabouts, ramps, and bridges into the scene. Adjust signal timings, change traffic density, and run a simulation.

Each vehicle has its own route, physical characteristics, and driving behavior. Click one to see where it’s going, how fast it’s moving, and why it’s waiting.

Change the network and run the simulation again to compare delays, queues, and completed trips.

Designed for desktop browsers.

## Engineering highlights

- Interactive Three.js 3D scene with orbit, pan, zoom, selection, and object manipulation
- Editable road network with placement previews, rotation, replacement, and undo
- Agent-based simulation with eight vehicle types and five driver profiles
- Lane-level geometry, vehicle routing, traffic signals, and congestion responses
- Deterministic fixed-step simulation using seeded randomness
- Comparison of traffic performance across simulation runs
- Separation of simulation logic from rendering and interface code
- Unit tests and automated browser verification

## The idea behind it

I was interested in making a complex system understandable through interaction.

Instead of treating the city as a static visualization, the environment becomes an editable model. Users aren’t merely watching traffic—they can change the rules and discover what happens.

It combines spatial interaction engineering with systems modeling, making cause and effect visible.`,
  },
  {
    slug: "handyman",
    name: "Handyman",
    blurb: "Point at a problem. Find a way through it.",
    live: "https://handyman.thepushh.com",
    code: "https://github.com/the-pushh/handy-man",
    order: 9,
    tags: JSON.stringify(["Next.js","React","TypeScript","Python","FastAPI","Meta Muse models","SAM 3.1","GSAP","Vercel","Modal"]),
    content: `What if software could understand the physical thing you’re looking at, rather than making you describe it through a chat box?

When something breaks at home, troubleshooting often involves searching for symptoms, watching videos, identifying parts, and trying to determine which instructions actually apply.

I built Handyman, a camera-first diagnostic assistant that helps people investigate appliance problems in the real world.

Built during the Meta hackathon, the project explores how multimodal models and visual grounding can turn a conversational AI system into a guided physical-world experience.

## The experience

Point your phone at an appliance and explain what’s wrong.

Handyman identifies the object, helps frame the camera, and starts with simple checks that people frequently overlook.

If the problem requires further investigation, it asks targeted questions, inspects specific components, or listens to mechanical sounds.

When a safe repair is possible, the application walks through the steps with spoken instructions and visual highlights placed on the actual photographed parts. It can rescan the appliance to check progress.

If the repair is unsafe or unsuccessful, it offers a handoff to a nearby professional with a prepared description of the diagnosis.

## Engineering highlights

- Camera-first mobile web experience with voice and text input
- Multimodal diagnosis using Meta Muse Spark
- Object segmentation and part highlighting using SAM 3.1
- Image annotations and audio analysis using Meta models
- Diagnostic agent that chooses questions and observations to distinguish possible causes
- Deterministic safety rules that screen model-generated advice
- Before-and-after image checks and step-level verification
- Localized spoken guidance, repair history, and professional handoff
- Model evaluations, safety tests, and controlled fallbacks

## The idea behind it

Most AI assistants make people translate their physical problems into words.

I wanted to explore the opposite: software that can see the object, understand the context, and guide someone through the real world with as little friction as possible.

The challenge was combining uncertain AI perception with an interface that remains clear, responsive, and cautious when mistakes have physical consequences.`,
  },
];

export const selectedProjectSlugs = selectedProjects.map(({ slug }) => slug);

export function addSelectedProjects(prisma: PrismaClient) {
  return prisma.project.createMany({
    data: selectedProjects.map((project) => ({
      ...project,
      kind: "project",
      role: "",
      when: "",
    })),
    skipDuplicates: true,
  });
}
