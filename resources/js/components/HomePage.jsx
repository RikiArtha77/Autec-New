import React from 'react';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative p-4">
      {/* Main Content */}
      <main className="flex flex-col items-center justify-center text-center p-10 bg-white/30 backdrop-blur-lg max-w-4xl w-full mx-auto mt-3 rounded-lg shadow-lg">
        <header className="text-gray-900">
          <h2 className="text-4xl font-bold mb-4">Solusi Digital untuk Pertanian Modern</h2>
          <p className="text-lg mb-6">Optimalkan hasil panen dengan teknologi pintar dan analisis data.</p>
          <a href="#services" className="bg-green-600 text-white px-6 py-2 rounded-full shadow-md font-semibold hover:bg-green-700">
            Pelajari Lebih Lanjut
          </a>
        </header>

        {/* About Section */}
        <section id="about" className="p-10 text-center bg-white/30 backdrop-blur-lg rounded-lg w-full max-w-2xl mx-auto my-6 shadow-md">
          <h3 className="text-3xl font-bold mb-4 text-gray-900">Tentang Kami</h3>
          <p className="text-gray-800">
            Kami menyediakan solusi berbasis teknologi untuk membantu petani meningkatkan hasil panen dan efisiensi produksi.
          </p>
        </section>

        {/* Services Section */}
        <section id="services" className="p-10 text-center bg-white/30 backdrop-blur-lg rounded-lg w-full max-w-4xl mx-auto my-6 shadow-md">
          <h3 className="text-3xl font-bold mb-4 text-gray-900">Layanan Kami</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/30 backdrop-blur-lg p-6 rounded-lg shadow-md">
              <h4 className="text-xl font-bold text-gray-900">Monitoring Tanaman</h4>
              <p className="text-gray-800">Pantau kondisi tanah dan cuaca secara real-time.</p>
            </div>
            <div className="bg-white/30 backdrop-blur-lg p-6 rounded-lg shadow-md">
              <h4 className="text-xl font-bold text-gray-900">Sistem Irigasi Otomatis</h4>
              <p className="text-gray-800">Pengaturan irigasi otomatis berbasis data.</p>
            </div>
            <div className="bg-white/30 backdrop-blur-lg p-6 rounded-lg shadow-md">
              <h4 className="text-xl font-bold text-gray-900">Analisis Data</h4>
              <p className="text-gray-800">Optimasi panen dengan kecerdasan buatan.</p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="p-10 text-center bg-white/30 backdrop-blur-lg rounded-lg w-full max-w-2xl mx-auto my-6 shadow-md">
          <h3 className="text-3xl font-bold mb-4 text-gray-900">Kontak Kami</h3>
          <p className="text-gray-800 mb-6">Hubungi kami untuk informasi lebih lanjut.</p>
          <a href="mailto:info@agrotech.com" className="bg-green-600 text-white px-6 py-2 rounded-full shadow-md font-semibold hover:bg-green-700">
            Email Kami
          </a>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
