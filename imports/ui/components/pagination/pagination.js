import { Template } from 'meteor/templating';
import './pagination.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

Template.pagination.onCreated(function () {
});

Template.pagination.helpers({
    paginationButtons() {
        const currentPage = Template.instance().data.currentPage;
        const totalPages = Template.instance().data.totalPages;

        let startPage, endPage;

        if (totalPages <= 5) {
            // Eğer toplam sayfa sayısı 5 veya daha azsa, hepsini göster
            startPage = 1;
            endPage = totalPages;
        } else {
            // Diğer durumlarda, mevcut sayfayı ortalayarak göster
            if (currentPage <= 3) {
                startPage = 1;
                endPage = 5;
            } else if (currentPage + 2 >= totalPages) {
                startPage = totalPages - 4;
                endPage = totalPages;
            } else {
                startPage = currentPage - 2;
                endPage = currentPage + 2;
            }
        }

        // Görüntülenecek sayfa numaralarını döndür
        return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    },
    isPreviousDisabled() {
        return Template.instance().data.currentPage <= 1;
    },
    isNextDisabled() {
        return Template.instance().data.currentPage >= Template.instance().data.totalPages;
    },
    isCurrentPage(page) {
        return Template.instance().data.currentPage === page;
    }
});

Template.pagination.events({
    'click .page-number'(event, templateInstance) {
        event.preventDefault();
        const page = parseInt(event.currentTarget.dataset.page, 10);
        if (page > 0) {
            FlowRouter.setQueryParams({ page: page });
        }
    },
    'click #previous-page'(event, templateInstance) {
        event.preventDefault();
        const page = Template.instance().data.currentPage;
        if (page > 1) {
            FlowRouter.setQueryParams({ page: page - 1 });
        }
    },
    'click #next-page'(event, templateInstance) {
        event.preventDefault();
        const page = Template.instance().data.currentPage;
        FlowRouter.setQueryParams({ page: page + 1 });
    }
});
