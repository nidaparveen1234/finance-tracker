const Spinner = ({ message = 'Loading...' }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem'
    }}>

      {/* The spinning circle */}
      <div style={{
        width: '40px',
        height: '40px',
        border: '4px solid #f0e0d0',
        borderTop: '4px solid #c17c5a',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />

      <p style={{ marginTop: '1rem', color: '#9e7b6b', fontSize: '0.9rem' }}>
        {message}
      </p>

      {/* The spin animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

    </div>
  );
};
// this is for spinning in wheel whe the it takes time for loading
export default Spinner;