import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

Template.games.onCreated(function () {
  this.subscribe('currentUserRoles');

  // Oyunları ve genre'leri saklamak için reaktif değişkenler
  this.games = new ReactiveVar([]);
  this.genres = new ReactiveVar([]);
  this.dataInfo = new ReactiveVar({});
  this.noResults = new ReactiveVar(false);
  this.loading = new ReactiveVar(true);

  // Authentication paneli kontrol değişkenleri
  this.showAuthPanel = new ReactiveVar(false);
  this.showLogin = new ReactiveVar(true);
  this.searchTerm = new ReactiveVar('');
  this.page = new ReactiveVar(1);
  this.selectedGenres = new ReactiveVar([]);

  const instance = this;

  // Genre'leri al
  Meteor.call('genres.getAll', (error, result) => {
    if (error) {
      console.error('Genre\'leri getirirken hata oluştu:', error);
    } else {
      instance.genres.set(result);
    }
  });

  const fetchGames = () => {
    const term = instance.searchTerm.get();
    let page = parseInt(instance.page.get(), 10);
    const selectedGenres = instance.selectedGenres.get();

    if (FlowRouter.getQueryParam('page') !== undefined) {
        FlowRouter.setQueryParams({ page: page });
    }

    const obj = { 
      page,
      limit: 10,
      term,
      selectedGenres,
     }

    instance.loading.set(true);
    Meteor.call("games.getGames", obj, (error, result) => {
      if (error) {
        console.error('Oyunları getirirken hata oluştu:', error);
        instance.noResults.set(true);
      } else {
        if (result.length === 0) {
          instance.noResults.set(true);
          instance.games.set([]);
        } else {
          instance.games.set(result);
          console.log(result)
          instance.dataInfo.set(result);
          instance.noResults.set(false);
        }
      }
      instance.loading.set(false);
    });
  };

  // URL'deki arama terimini, sayfa numarasını ve seçilen genre'leri kontrol et
  const term = FlowRouter.getQueryParam('term');
  const selectedGenres = FlowRouter.getQueryParam('genres') ? FlowRouter.getQueryParam('genres').split(',') : [];
  let page = parseInt(FlowRouter.getQueryParam('page'), 10) || 1;

  if (page <= 0) {
    page = 1;
  }

  instance.searchTerm.set(term || '');
  instance.page.set(page);
  instance.selectedGenres.set(selectedGenres);

  this.autorun(() => {
    fetchGames();
    // const searchTerm = instance.searchTerm.get();
    // const page = instance.page.get();
    // const selectedGenres = instance.selectedGenres.get();

    // if (searchTerm !== FlowRouter.getQueryParam('term') || page !== parseInt(FlowRouter.getQueryParam('page'), 10) || !arraysEqual(selectedGenres, (FlowRouter.getQueryParam('genres') ? FlowRouter.getQueryParam('genres').split(',') : []))) {
    //   FlowRouter.setQueryParams({ term: searchTerm, page: page, genres: selectedGenres.join(',') });
    // }
  });
});

Template.games.helpers({
  gamesCount() {
    const dataInfo = Template.instance().dataInfo.get();
    return dataInfo.totalGames || 0; // Eğer totalGames yoksa 0 döndür
  },

  games() {
    const data = Template.instance().games.get();
    // Eğer data bir nesne ise, diziye dönüştürün
    return Array.isArray(data) ? data : data.games || [];
  },

  noResults() {
    return Template.instance().noResults.get();
  },

  formattedCreatedAt() {
    return this.createdAt.toLocaleString();
  },

  formattedGenres() {
    const genreDetails = this.genreDetails || [];
    return genreDetails.map(genre => genre.name).join(', ');
  },

  loading() {
    return Template.instance().loading.get();
  },

  genres() {
    return Template.instance().genres.get();
  },

  isSelected(genreId) {
    return Template.instance().selectedGenres.get().includes(genreId);
  },

  totalPages() {
    console.log("totalpages")
    const dataInfo = Template.instance().dataInfo.get();
    console.log(dataInfo)
    console.log(Math.max(1, Math.ceil(dataInfo.totalGames / 10)))
    return Math.max(1, Math.ceil(dataInfo.totalGames / 10));
  },

  totalPagesInRange() {
    const dataInfo = Template.instance().dataInfo.get();
    const totalPages = dataInfo.totalPages || 0;
    let range = [];
    for (let i = 1; i <= totalPages; i++) {
      range.push(i);
    }
    return range;
  },

  isCurrentPage(page) {
    return Template.instance().page.get() === page;
  },

  isPreviousDisabled() {
    return Template.instance().page.get() <= 1;
  },

  isNextDisabled() {
    const instance = Template.instance();
    const dataInfo = instance.dataInfo.get(); // dataInfo'yu al
    const page = dataInfo.currentPage; // Mevcut sayfa numarasını al
    const totalPages = dataInfo.totalPages || 0;
    return page >= totalPages;
  }
});

Template.games.events({
  'click .page-number'(event, templateInstance) {
    event.preventDefault();
    const page = parseInt(event.currentTarget.dataset.page, 10);
    if (page > 0) {
      templateInstance.page.set(page);
      FlowRouter.setQueryParams({ page: page});
    }
  },

  'click #previous-page'(event, templateInstance) {
    event.preventDefault();
    let page = templateInstance.page.get();
    if (page > 1) {
      page -= 1;
      templateInstance.page.set(page);
      FlowRouter.setQueryParams({ page: page});
    }
  },

  'click #next-page'(event, templateInstance) {
    event.preventDefault();
    let page = templateInstance.page.get();
    page += 1;
    templateInstance.page.set(page);
    FlowRouter.setQueryParams({ page: page});
  },

  'click #search-button'(event, templateInstance) {
    event.preventDefault();

    const searchTerm = templateInstance.find("#search-input").value.trim();
    templateInstance.searchTerm.set(searchTerm);
    templateInstance.page.set(1);

    FlowRouter.setQueryParams({ term: searchTerm, page: 1, genres: templateInstance.selectedGenres.get().join(',') });
  },

  'click .dropdown-item'(event, instance) {
    event.preventDefault();
    const genreId = this._id;
    let selectedGenres = instance.selectedGenres.get();

    if (selectedGenres.includes(genreId)) {
      selectedGenres = selectedGenres.filter(id => id !== genreId);
    } else {
      selectedGenres.push(genreId);
    }

    instance.selectedGenres.set(selectedGenres);

    instance.page.set(1);
    FlowRouter.setQueryParams({ genres: selectedGenres.join(','), term: instance.searchTerm.get(), page: instance.page.get() });
  }
});