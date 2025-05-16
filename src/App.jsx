import { useState } from 'react';

export default function App() {
  const [image, setImage] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [aspect, setAspect] = useState('1:1');
  const [generatedImage, setGeneratedImage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  const generateImage = async () => {
    if (!image || !prompt) return alert('Please provide both image and prompt.');

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result.split(',')[1];
      setLoading(true);

      try {
        const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
        if (!apiKey) throw new Error('API key missing');

        const visionResponse = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "gpt-4o",
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: `Describe this image and apply user prompt: ${prompt}`
                  },
                  {
                    type: "image_url",
                    image_url: { url: `data:image/jpeg;base64,${base64Image}` }
                  }
                ]
              }
            ],
            max_tokens: 300
          })
        });

        
        const visionData = await visionResponse.json();
        if (!visionResponse.ok || !visionData.choices?.[0]) throw new Error(visionData.error?.message || 'Vision API failed');
        // console.log("successfully read image")
        
        const imageDescription = visionData.choices[0].message.content;
        // console.log(imageDescription)

        const sizeMap = {
          '1:1': '1024x1024',
          '3:2': '1536x1024',
          '2:3': '1024x1536',
          'Auto': 'auto'
        };

        const image1Response = await fetch("https://api.openai.com/v1/images/generations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "gpt-image-1",
            prompt: `Based on this: ${imageDescription}. Modify with: ${prompt}`,
            size: sizeMap[aspect],
            quality: "low",
          })
        });

        const image1Data = await image1Response.json();

        // console.log(image1Data)
        if (image1Data.error) throw new Error(image1Data.error.message);

        if (image1Data.data && image1Data.data[0]) {
          const base64Data = image1Data.data[0].b64_json;
          // Convert base64 to data URL for display
          const imageDataUrl = `data:image/png;base64,${base64Data}`;
          setGeneratedImage(imageDataUrl);
        } else {
          throw new Error('No image data received');
        }

      } catch (err) {
        console.error('Error details:', err);
        alert(`Error generating image: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(image);
  };

   // Helper function to download the generated image
   const downloadImage = () => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `vic-ai-generated-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-purple-100 to-blue-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300/30 rounded-full mix-blend-multiply filter blur-xl opacity-80 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300/30 rounded-full mix-blend-multiply filter blur-xl opacity-80 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-rose-700/30 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse"></div>
      </div>
  
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
        <div className="bg-white/70 backdrop-blur-lg p-8 rounded-3xl shadow-lg border border-white/40 w-full max-w-2xl space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              ✨ AI Image Transformer
            </h1>
            <p className="text-gray-600 text-lg">Transform your images with the power of AI</p>
          </div>
  
          {/* Upload Section */}
          <div className="space-y-3">
            <label className="text-gray-700 font-medium text-sm uppercase tracking-wider">Upload Reference Image</label>
            <div className="relative group">
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="block w-full p-6 border-2 border-dashed border-sky-100 rounded-2xl cursor-pointer transition-all duration-300 hover:border-sky-300 hover:bg-purple-50 group-hover:scale-102"
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">📸</div>
                  <div className="text-gray-700 font-medium">Click to upload an image</div>
                  <div className="text-gray-500 text-sm mt-1">or drag and drop</div>
                </div>
              </label>
            </div>
          </div>
  
          {/* Image Preview */}
          {image && (
            <div className="space-y-3 animate-in slide-in-from-bottom duration-500">
              <label className="text-gray-700 font-medium text-sm uppercase tracking-wider">Preview</label>
              <div className="relative group overflow-hidden rounded-2xl shadow-md">
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          )}
  
          {/* Prompt Input */}
          <div className="space-y-3">
            <label className="text-gray-700 font-medium text-sm uppercase tracking-wider">Transformation Prompt</label>
            <div className="relative">
              <input
                type="text"
                className="w-full p-4 bg-white/60 backdrop-blur-sm border border-rose-100 rounded-2xl text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent transition-all duration-300 hover:bg-white/80"
                placeholder="e.g., turn it into a cyberpunk artwork, vintage poster, oil painting..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-200/20 to-rose-200/20 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </div>
  
          {/* Aspect Ratio */}
          <div className="space-y-3">
            <label className="text-gray-700 font-medium text-sm uppercase tracking-wider">Aspect Ratio</label>
            <select
              className="w-full p-4 bg-white/60 backdrop-blur-sm border border-purple-200 rounded-2xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 hover:bg-white/80"
              value={aspect}
              onChange={(e) => setAspect(e.target.value)}
            >
              <option value="1:1" className="bg-white">Square (1:1)</option>
              <option value="3:2" className="bg-white">Landscape (3:2)</option>
              <option value="2:3" className="bg-white">Portrait (2:3)</option>
              <option value="Auto" className="bg-white">Auto</option>
            </select>
          </div>
  
          {/* Generate Button */}
          <button
            onClick={generateImage}
            disabled={loading || !image || !prompt}
            className="w-full relative group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-rose-400 via-purple-400 to-blue-400 rounded-2xl"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-rose-400 via-purple-400 to-blue-400 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
            <div className="relative bg-gradient-to-r from-rose-400 via-purple-400 to-blue-400 text-white py-4 rounded-2xl font-bold text-lg tracking-wide transition-all duration-300 group-hover:scale-105 disabled:from-gray-400 disabled:via-gray-400 disabled:to-gray-400 disabled:scale-100 disabled:cursor-not-allowed">
              {loading ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Generating Magic...</span>
                </div>
              ) : (
                "✨ Generate Image"
              )}
            </div>
          </button>
  
          {/* Generated Image */}
          {generatedImage && (
            <div className="space-y-4 animate-in slide-in-from-bottom duration-700">
              <label className="text-gray-700 font-medium text-sm uppercase tracking-wider">Generated Image</label>
              <div className="relative group overflow-hidden rounded-2xl shadow-md">
                <img 
                  src={generatedImage} 
                  alt="Generated" 
                  className="w-full rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <button
                onClick={downloadImage}
                className="block w-full text-center relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-blue-400 rounded-2xl"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-blue-400 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                <div className="relative bg-gradient-to-r from-sky-400 to-blue-400 text-white px-6 py-3 rounded-2xl font-bold transition-all duration-300 group-hover:scale-105">
                  💾 Download Image
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}