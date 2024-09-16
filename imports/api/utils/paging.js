export const getPagingData = ({ page = 1, limit = 10, totalCount }) => {
  // Toplam sayfa sayısını hesapla
  const totalPages = Math.ceil(totalCount / limit);

  // Şu anki sayfanın geçerli olup olmadığını kontrol et
  const currentPage = Math.max(1, Math.min(page, totalPages));

  // Veri listelerken atlanacak veri sayısı (skip)
  const skip = (currentPage - 1) * limit;

  return {
    totalPages,  // Toplam sayfa sayısı
    currentPage, // Şu anki sayfa numarası
    skip,        // Verileri atlama miktarı (skip için)
  };
};