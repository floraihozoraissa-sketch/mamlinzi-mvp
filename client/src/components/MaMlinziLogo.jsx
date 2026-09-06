function MamlinziLogo({ className = "", compact = false }) {
  return (
    <div className={`mamlinzi-logo ${compact ? "compact" : ""} ${className}`}>
      <img
        src="/mamlinzi-logo.svg"
        alt="MaMlinzi"
      />

      {/* {!compact && (
        <div className="mamlinzi-logo-text">
          <strong>MaMlinzi</strong>
          <span>Maternal care companion</span>
        </div>
      )} */}
    </div>
  );
}

export default MamlinziLogo;