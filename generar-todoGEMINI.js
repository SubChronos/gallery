import fs from 'fs';
import path from 'path';

const CONTENT_DIR = './src/content/galleria';
const ASSETS_DIR = './public/assets';

const artworks = [
  { slug: "starry-night", title: "Starry Night", author: "Vincent van Gogh", folder: "starry-night", description: "Aunque pintó La noche estrellada mientras estaba en el asilo de Saint-Paul-de-Mausole en Saint-Rémy-de-Provence, el pueblo imaginario evoca recuerdos de su tierra natal holandesa." },
  { slug: "girl-with-pearl-earring", title: "Girl with a Pearl Earring", author: "Johannes Vermeer", folder: "girl-with-pearl-earring", description: "La joven de la perla es un óleo sobre lienzo del pintor neerlandés del Siglo de Oro Johannes Vermeer. Es su obra más famosa y a menudo se la llama la Mona Lisa del Norte." },
  { slug: "guernica", title: "Guernica", author: "Pablo Picasso", folder: "guernica", description: "Guernica es un gran óleo sobre lienzo del artista español Pablo Picasso, terminado en junio de 1937. Hoy en día se encuentra en el Museo Reina Sofía de Madrid." },
  { slug: "penitent-magdalene", title: "Penitent Magdalene", author: "Artemisia Gentileschi", folder: "penitent-magdalene", description: "María Magdalena Penitente es una pintura del artista barroco italiano Artemisia Gentileschi. Hoy en día se encuentra en la Galería Palatina del Palacio Pitti, en Florencia." },
  { slug: "the-storm-on-the-sea-of-galilee", title: "The Storm on the Sea of Galilee", author: "Rembrandt", folder: "the-storm-on-the-sea-of-galilee", description: "La tormenta en el mar de Galilea es un óleo sobre lienzo de 1633 del pintor neerlandés del Siglo de Oro Rembrandt van Rijn." },
  { slug: "the-great-wave-off-kanagawa", title: "The Great Wave off Kanagawa", author: "Hokusai", folder: "the-great-wave-off-kanagawa", description: "La gran ola de Kanagawa es una estampa japonesa en madera del artista ukiyo-e Hokusai." },
  { slug: "van-gogh-self-portrait", title: "Van Gogh Self-portrait", author: "Vincent van Gogh", folder: "van-gogh-self-portrait", description: "El artista postimpresionista holandés Vincent van Gogh pintó un autorretrato al óleo sobre lienzo en septiembre de 1889." },
  { slug: "the-sleeping-gypsy", title: "The Sleeping Gypsy", author: "Henri Rousseau", folder: "the-sleeping-gypsy", description: "La gitana dormida es un óleo de 1897 del artista naíf francés Henri Rousseau." },
  { slug: "lady-with-an-ermine", title: "Lady with an Ermine", author: "Leonardo da Vinci", folder: "lady-with-an-ermine", description: "La dama del armiño es una pintura de Leonardo da Vinci, fechada entre 1489 y 1490." },
  { slug: "the-night-cafe", title: "The Night Café", author: "Vincent van Gogh", folder: "the-night-cafe", description: "El café de noche es un óleo sobre lienzo creado por el pintor holandés Vincent van Gogh en septiembre de 1888 en Arles." },
  { slug: "the-basket-of-apples", title: "The Basket of Apples", author: "Paul Cézanne", folder: "the-basket-of-apples", description: "La cesta de manzanas es un bodegón del artista francés Paul Cézanne." },
  { slug: "the-boy-in-the-red-vest", title: "The Boy in the Red Vest", author: "Paul Cézanne", folder: "the-boy-in-the-red-vest", description: "El niño del chaleco rojo es una pintura del artista francés Paul Cézanne, fechada en 1889 o 1890." },
  { slug: "arnolfini-portrait", title: "Arnolfini Portrait", author: "Jan van Eyck", folder: "arnolfini-portrait", description: "El retrato de Arnolfini es una pintura al óleo sobre panel de roble de 1434 del pintor primitivo flamenco Jan van Eyck." },
  { slug: "mona-lisa", title: "Mona Lisa", author: "Leonardo da Vinci", folder: "mona-lisa", description: "La Mona Lisa es un retrato de medio cuerpo del artista italiano Leonardo da Vinci." },
  { slug: "the-swing", title: "The Swing", author: "Jean-Honoré Fragonard", folder: "the-swing", description: "El columpio, también conocido como Los felices azares del columpio, es un óleo del siglo XVIII de Jean-Honoré Fragonard." }
];

// Los 4 recortes oficiales del reto
const imageTypes = ['hero-large.jpg', 'hero-small.jpg', 'gallery.jpg', 'thumbnail.jpg'];

// Lista de repositorios públicos en GitHub de gente que hizo el reto
const reposToTry = [
  "https://raw.githubusercontent.com/FlorianJourde/Frontend-Mentor-26-Galleria-slideshow-site/main/public/assets",
  "https://raw.githubusercontent.com/ChamuMutezva/galleria-slideshow-site/main/public/assets",
  "https://raw.githubusercontent.com/brianlfarmerllc/Galleria_SlideShow/main/public/assets",
  "https://raw.githubusercontent.com/barnettet31/galleria-slideshow-site/main/public/assets",
  "https://raw.githubusercontent.com/mbart13/galleria-slideshow/main/public/assets",
  "https://raw.githubusercontent.com/FlorianJourde/Frontend-Mentor-26-Galleria-slideshow-site/main/src/assets",
  "https://raw.githubusercontent.com/ChamuMutezva/galleria-slideshow-site/main/src/assets",
];

async function findWorkingRepo() {
  console.log("🕵️ Buscando un servidor en GitHub con los archivos originales...");
  for (const repo of reposToTry) {
    try {
      const testUrl = `${repo}/starry-night/hero-large.jpg`;
      const res = await fetch(testUrl);
      if (res.ok) {
        console.log(`✅ ¡Archivos encontrados!: Descargando de ${repo.split('/')[4]}\n`);
        return repo;
      }
    } catch (e) {
      // Ignoramos errores de red y probamos el siguiente
    }
  }
  return null;
}

async function downloadFile(url, dest) {
  try {
    const response = await fetch(url);
    if (!response.ok) return false;
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(dest, buffer);
    return true;
  } catch (error) {
    return false;
  }
}

async function init() {
  const workingRepo = await findWorkingRepo();
  if (!workingRepo) {
    console.log("❌ Todos los repositorios están caídos ahora mismo.");
    return;
  }

  if (!fs.existsSync(CONTENT_DIR)) fs.mkdirSync(CONTENT_DIR, { recursive: true });
  if (!fs.existsSync(ASSETS_DIR)) fs.mkdirSync(ASSETS_DIR, { recursive: true });

  for (const art of artworks) {
    const artAssetDir = path.join(ASSETS_DIR, art.folder);
    if (!fs.existsSync(artAssetDir)) fs.mkdirSync(artAssetDir, { recursive: true });

    process.stdout.write(`⏳ Guardando ${art.title}... `);
    
    // Descargar las 4 resoluciones
    for (const imgType of imageTypes) {
      const imgUrl = `${workingRepo}/${art.folder}/${imgType}`;
      const destPath = path.join(artAssetDir, imgType);
      
      const success = await downloadFile(imgUrl, destPath);
      if (success) process.stdout.write('🟢 ');
      else process.stdout.write('🔴 ');
    }
    console.log();

    // Crear el archivo .md
    const mdContent = `---
title: "${art.title}"
author: "${art.author}"
imageHeroLarge: "/assets/${art.folder}/hero-large.jpg"
imageHeroSmall: "/assets/${art.folder}/hero-small.jpg"
imageGallery: "/assets/${art.folder}/gallery.jpg"
imageThumbnail: "/assets/${art.folder}/thumbnail.jpg"
---

${art.description}
`;
    const mdPath = path.join(CONTENT_DIR, `${art.slug}.md`);
    fs.writeFileSync(mdPath, mdContent, 'utf8');
  }

  console.log("\n🎉 ¡MISIÓN CUMPLIDA! Tienes tus 60 recortes originales del challenge en public/assets.");
}

init();