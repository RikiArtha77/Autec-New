import React, { useState } from 'react';
import axios from 'axios';

const BecomeFarmerPage = () => {
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/become-farmer', {
        reason
      }, {
        withCredentials: true,
      });

      setStatus(response.data.message || 'Permintaan berhasil dikirim.');
      setReason('');
    } catch (error) {
      setStatus('Gagal mengirim permintaan.');
      console.error(error);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-lg mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Ajukan Permintaan Menjadi Petani</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="reason" className="block font-medium mb-1">
            Alasan ingin menjadi petani
          </label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows="4"
            className="w-full border border-gray-300 p-2 rounded-lg"
            placeholder="Tuliskan alasan kamu di sini..."
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
        >
          Kirim Permintaan
        </button>
        {status && <p className="text-center text-sm text-gray-700 mt-2">{status}</p>}
      </form>
    </div>
  );
};

export default BecomeFarmerPage;
