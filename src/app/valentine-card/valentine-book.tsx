"use client";

import NextImage from "next/image";
import { useEffect, useState } from "react";

import styles from "./valentine-card.module.css";

type CardPage = {
  body: string;
  id: string;
  role: "cover" | "inside" | "end";
  title: string;
};

const CARD_PAGES: CardPage[] = [
  {
    body: "A little card-book made to open one page at a time.",
    id: "cover",
    role: "cover",
    title: "Coucou",
  },
  {
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse potenti. Vivamus tristique luctus diam et lacinia.",
    id: "page-1",
    role: "inside",
    title: "Page One",
  },
  {
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc nec nibh id magna vestibulum tempus vel vitae turpis.",
    id: "page-2",
    role: "inside",
    title: "Page Two",
  },
  {
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sed odio vel ante feugiat bibendum quis at lacus.",
    id: "page-3",
    role: "inside",
    title: "Page Three",
  },
  {
    body: "The End",
    id: "the-end",
    role: "end",
    title: "The End",
  },
];

const CUSTOM_SUBTITLE = "The most amazing and beautiful angel of a person in the world who makes me feel like the luckiest person in the world.";

function removeBlueBackdrop(image: HTMLImageElement): string {
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;

  const context = canvas.getContext("2d");
  if (!context) {
    return "/valentine-cover-cutout.svg";
  }

  context.drawImage(image, 0, 0);
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

  const sampleRadius = 18;
  let redTotal = 0;
  let greenTotal = 0;
  let blueTotal = 0;
  let sampleCount = 0;

  const samplePixel = (x: number, y: number) => {
    const index = (y * canvas.width + x) * 4;
    redTotal += pixels[index];
    greenTotal += pixels[index + 1];
    blueTotal += pixels[index + 2];
    sampleCount += 1;
  };

  for (let y = 0; y < canvas.height; y += 1) {
    for (let x = 0; x < canvas.width; x += 1) {
      const nearLeft = x < sampleRadius;
      const nearRight = x >= canvas.width - sampleRadius;
      const nearTop = y < sampleRadius;
      const nearBottom = y >= canvas.height - sampleRadius;

      if (nearLeft || nearRight || nearTop || nearBottom) {
        samplePixel(x, y);
      }
    }
  }

  const averageRed = redTotal / sampleCount;
  const averageGreen = greenTotal / sampleCount;
  const averageBlue = blueTotal / sampleCount;

  const threshold = 75;
  const softEdge = 28;

  for (let index = 0; index < pixels.length; index += 4) {
    const red = pixels[index];
    const green = pixels[index + 1];
    const blue = pixels[index + 2];

    const distance = Math.sqrt(
      (red - averageRed) ** 2 +
        (green - averageGreen) ** 2 +
        (blue - averageBlue) ** 2,
    );

    const likelyBlueBackdrop =
      blue >= red + 20 && green >= red + 10 && blue >= 130;

    if (distance < threshold && likelyBlueBackdrop) {
      pixels[index + 3] = 0;
      continue;
    }

    if (distance < threshold + softEdge && likelyBlueBackdrop) {
      const blend = (distance - threshold) / softEdge;
      pixels[index + 3] = Math.round(pixels[index + 3] * blend);
    }
  }

  context.putImageData(imageData, 0, 0);
  return canvas.toDataURL("image/png");
}

export function ValentineBook() {
  const [turnedPages, setTurnedPages] = useState(0);
  const [coverArtSource, setCoverArtSource] = useState("/valentine-cover-cutout.svg");
  const [leftPageImages, setLeftPageImages] = useState<Record<number, string | null>>(
    {},
  );
  const maxTurns = CARD_PAGES.length - 1;
  const hasSpreadOpen = turnedPages > 0;

  useEffect(() => {
    let active = true;
    const coverImage = new window.Image();
    const coverCandidates = [
      "/valentine-cover.png",
      "/valentine-cover.jpg",
      "/valentine-cover.jpeg",
    ];

    const tryCoverAtIndex = (index: number) => {
      if (!active) {
        return;
      }

      if (index >= coverCandidates.length) {
        setCoverArtSource("/valentine-cover-cutout.svg");
        return;
      }

      coverImage.onload = () => {
        if (!active) {
          return;
        }
        setCoverArtSource(removeBlueBackdrop(coverImage));
      };

      coverImage.onerror = () => {
        tryCoverAtIndex(index + 1);
      };

      coverImage.src = coverCandidates[index];
    };

    tryCoverAtIndex(0);

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    const resolveImage = async (
      candidates: string[],
    ): Promise<string | null> => {
      for (const source of candidates) {
        const exists = await new Promise<boolean>((resolve) => {
          const image = new window.Image();
          image.onload = () => resolve(true);
          image.onerror = () => resolve(false);
          image.src = source;
        });

        if (exists) {
          return source;
        }
      }
      return null;
    };

    const loadLeftPageImages = async () => {
      const loaded: Record<number, string | null> = {};

      for (let index = 0; index < CARD_PAGES.length; index += 1) {
        const pageNumber = index + 1;
        const imageSource = await resolveImage([
          `/valentine-left-${pageNumber}.png`,
          `/valentine-left-${pageNumber}.jpg`,
          `/valentine-left-${pageNumber}.jpeg`,
          "/valentine-left.png",
          "/valentine-left.jpg",
          "/valentine-left.jpeg",
        ]);
        loaded[index] = imageSource;
      }

      if (active) {
        setLeftPageImages(loaded);
      }
    };

    void loadLeftPageImages();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className={styles.scene}>
      <div className={styles.glowA} />
      <div className={styles.glowB} />

      <section className={styles.cardArea}>
        <header className={styles.pageHeader}>
          <h1 className={styles.title}>To: Ning</h1>
          {CUSTOM_SUBTITLE ? (
            <p className={styles.subtitle}>{CUSTOM_SUBTITLE}</p>
          ) : null}
        </header>

        <div
          className={`${styles.book} ${hasSpreadOpen ? styles.bookSpread : ""}`}
          aria-label="Virtual Valentine card with turning pages"
        >
          {CARD_PAGES.map((page, index) => {
            const isTurned = index < turnedPages;
            const isTopPage = index === turnedPages;
            const isCover = page.role === "cover";
            const isEnd = page.role === "end";
            const zIndex = isTopPage
              ? CARD_PAGES.length + 50
              : isTurned
                ? CARD_PAGES.length + index
                : CARD_PAGES.length - index;

            return (
              <article
                className={`${styles.sheet} ${isTurned ? styles.sheetTurned : ""}`}
                key={page.id}
                style={{ zIndex }}
              >
                <div className={`${styles.face} ${styles.frontFace}`}>
                  {isCover ? (
                    <div className={styles.coverLayout}>
                      <NextImage
                        alt="Banana cat cover art"
                        className={styles.coverArt}
                        height={540}
                        src={coverArtSource}
                        unoptimized
                        width={460}
                      />
                    </div>
                  ) : (
                    <div className={styles.pageContent}>
                      <h2 className={styles.pageTitle}>{page.title}</h2>
                      <p className={styles.pageBody}>{page.body}</p>
                      {isTopPage && !isEnd ? (
                        <p className={styles.pageCorner}>turn me →</p>
                      ) : null}
                    </div>
                  )}
                </div>

                <div className={`${styles.face} ${styles.backFace}`}>
                  <div className={styles.leftPageSurface}>
                    {leftPageImages[index] ? (
                      <NextImage
                        alt={`Left page image ${index + 1}`}
                        className={styles.leftPageImage}
                        fill
                        src={leftPageImages[index]!}
                        unoptimized
                      />
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}

          <button
            aria-label="Turn to previous page"
            className={`${styles.leftHitZone} ${hasSpreadOpen ? styles.leftHitZoneSpread : ""}`}
            disabled={turnedPages === 0}
            onClick={() => setTurnedPages((current) => Math.max(current - 1, 0))}
            type="button"
          />
          <button
            aria-label="Turn to next page"
            className={styles.rightHitZone}
            disabled={turnedPages >= maxTurns}
            onClick={() =>
              setTurnedPages((current) => Math.min(current + 1, maxTurns))
            }
            type="button"
          />
        </div>
      </section>
    </main>
  );
}
