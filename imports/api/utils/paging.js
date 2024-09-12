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


export const getPaginationButtons = (currentPage, totalPages) => {
  const maxButtons = 5;
  const buttons = [];

  // Başlangıç ve bitiş sayfa numaralarını hesapla
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, currentPage + 2);

  // Sayfa başı durumu için aralığı ayarla
  if (currentPage <= 2) {
    endPage = Math.min(totalPages, startPage + maxButtons - 1);
  }

  // Sayfa sonu durumu için aralığı ayarla
  if (currentPage >= totalPages - 1) {
    startPage = Math.max(1, totalPages - maxButtons + 1);
  }

  // Sayfa numaralarını doldur
  for (let i = startPage; i <= endPage; i++) {
    buttons.push(i);
  }

  return buttons;
};