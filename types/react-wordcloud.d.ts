declare module 'react-wordcloud' {
  interface WordCloudOptions {
    rotations?: number;
    rotationAngles?: [number, number];
    fontSizes?: [number, number];
    padding?: number;
    colors?: string[];
  }

  interface Word {
    text: string;
    value: number;
  }

  interface WordCloudProps {
    words: Word[];
    options?: WordCloudOptions;
  }

  const WordCloud: React.FC<WordCloudProps>;
  export default WordCloud;
} 