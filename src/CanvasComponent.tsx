/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createClient } from '@supabase/supabase-js';
import { useEffect, useRef, useState } from 'react';
import { TwitterTweetEmbed } from 'react-twitter-embed';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

const CanvasComponent = () => {
  const canvasRef = useRef(null);
  const [tweetId, setTweetId] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current as unknown as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    // Load images
    const image1 = new Image();
    image1.src = 'image1.jpg';
    const image2 = new Image();
    image2.src = 'image2.jpg';

    // Wait for images to load
    Promise.all([
      new Promise(resolve => image1.addEventListener('load', resolve)),
      new Promise(resolve => image2.addEventListener('load', resolve)),
    ]).then(() => {
      // Draw images on canvas
      ctx.drawImage(image1, 0, 0, 250, 250);
      ctx.drawImage(image2, 250, 0, 250, 250);

      // Add text
      ctx.font = '30px Arial';
      ctx.fillText('Hello World', 150, 450);
    });
  }, []);

  const shareOnTwitter = async () => {
    const canvas = canvasRef.current as unknown as HTMLCanvasElement;
    const blob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b!)));
    const file = new File([blob], 'canvas-image.png', { type: blob.type });

    // Upload the image to Supabase storage
    const { data, error } = await supabase.storage
      .from('images')
      .upload(`canvas-images/${Date.now()}.png`, file);

    if (error) {
      console.error('Error uploading image to Supabase:', error);
      return;
    }

    // Get the public URL of the uploaded image
    // @ts-expect-error
    const { data: publicData, error: urlError } = supabase.storage
      .from('images')
      .getPublicUrl(data.path);

    const publicURL = publicData.publicUrl;
    console.log("*** publicData", publicData);
    console.log("*** publicURL", publicURL);

    if (urlError) {
      console.error('Error getting public URL:', urlError);
      return;
    }

    // Post a tweet with the image URL
    const tweetText = 'Check out my canvas image!';
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(publicURL)}`;

    window.open(tweetUrl, '_blank');

    // get the tweet ID
    const tweetResponse = await fetch(tweetUrl);
    const tweetData = await tweetResponse.json();
    console.log("*** tweetData", tweetData);  

    // Alternatively, you can use the Twitter API to post the tweet and get the tweet ID
    // Then, set the tweetId state to display the embedded tweet
    setTweetId(tweetData.id_str);
  };

  return (
    <div>
      <canvas ref={canvasRef} width={500} height={500} />
      <button onClick={shareOnTwitter}>Share on Twitter</button>
      {tweetId && (
        <div className="mt-4">
          <TwitterTweetEmbed tweetId={tweetId} />
        </div>
      )}
    </div>
  );
};

export default CanvasComponent;