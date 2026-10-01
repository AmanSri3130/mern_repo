import { useState, useEffect } from 'react';

export default function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [gallery, setGallery] = useState([]);
  const [status, setStatus] = useState('');

  const fetchImages = async () => {
    try {
      const res = await fetch('http://localhost:5004/api/images');
      const data = await res.json();
      if (data.success) setGallery(data.images);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setStatus('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setStatus('Please select an image first.');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      setStatus('Uploading...');
      const res = await fetch('http://localhost:5004/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      if (res.ok) {
        setStatus('Upload Successful!');
        setSelectedFile(null);
        setPreviewUrl('');
        fetchImages();
      } else {
        setStatus(data.message || 'Upload failed');
      }
    } catch (err) {
      setStatus('Error uploading image');
    }
  };

  return (
    <div className="container">
      <h1>Multer Image Upload Feature</h1>

      <div className="upload-box">
        <h3>Select & Preview Image</h3>
        <p style={{ color: '#94a3b8', margin: '0.5rem 0' }}>Upload single image file (JPG, PNG, GIF)</p>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ marginTop: '1rem', color: '#cbd5e1' }}
        />

        {previewUrl && (
          <div className="preview-container">
            <h4 style={{ marginBottom: '0.5rem' }}>Live Preview:</h4>
            <img src={previewUrl} alt="Preview" className="preview-img" />
          </div>
        )}

        <br />
        <button onClick={handleUpload} className="btn-upload">Upload to Server</button>
        {status && <p style={{ marginTop: '1rem', color: '#38bdf8' }}>{status}</p>}
      </div>

      <div className="gallery-section">
        <h2>Uploaded Images Gallery</h2>
        {gallery.length === 0 ? (
          <p style={{ color: '#64748b', marginTop: '1rem' }}>No images uploaded yet.</p>
        ) : (
          <div className="gallery-grid">
            {gallery.map((img, idx) => (
              <div key={idx} className="gallery-card">
                <img src={img.url} alt={img.filename} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
