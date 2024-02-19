'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">ita-challenges-frontend documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="license.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>LICENSE
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-AppModule-9da65ca37876c0a974eb33613cf515cf39463d123fa8c9dd4132d72fd8349ca3ef54a631760fd04a11fc6c5cbeb3098d10ccbd6cd72e0e4e6b2aef3fd741d838"' : 'data-bs-target="#xs-components-links-module-AppModule-9da65ca37876c0a974eb33613cf515cf39463d123fa8c9dd4132d72fd8349ca3ef54a631760fd04a11fc6c5cbeb3098d10ccbd6cd72e0e4e6b2aef3fd741d838"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-9da65ca37876c0a974eb33613cf515cf39463d123fa8c9dd4132d72fd8349ca3ef54a631760fd04a11fc6c5cbeb3098d10ccbd6cd72e0e4e6b2aef3fd741d838"' :
                                            'id="xs-components-links-module-AppModule-9da65ca37876c0a974eb33613cf515cf39463d123fa8c9dd4132d72fd8349ca3ef54a631760fd04a11fc6c5cbeb3098d10ccbd6cd72e0e4e6b2aef3fd741d838"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AppModule-9da65ca37876c0a974eb33613cf515cf39463d123fa8c9dd4132d72fd8349ca3ef54a631760fd04a11fc6c5cbeb3098d10ccbd6cd72e0e4e6b2aef3fd741d838"' : 'data-bs-target="#xs-injectables-links-module-AppModule-9da65ca37876c0a974eb33613cf515cf39463d123fa8c9dd4132d72fd8349ca3ef54a631760fd04a11fc6c5cbeb3098d10ccbd6cd72e0e4e6b2aef3fd741d838"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-9da65ca37876c0a974eb33613cf515cf39463d123fa8c9dd4132d72fd8349ca3ef54a631760fd04a11fc6c5cbeb3098d10ccbd6cd72e0e4e6b2aef3fd741d838"' :
                                        'id="xs-injectables-links-module-AppModule-9da65ca37876c0a974eb33613cf515cf39463d123fa8c9dd4132d72fd8349ca3ef54a631760fd04a11fc6c5cbeb3098d10ccbd6cd72e0e4e6b2aef3fd741d838"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link" >AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ChallengeModule.html" data-type="entity-link" >ChallengeModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-ChallengeModule-e143426dbb89f5eb4f5accfe8b9c6fe824d4c957b01fe01407f09698a4298beb1f39880f4f0cea28fa6a65339238f23120994e3ba2a50252e0b1ee37155a2147"' : 'data-bs-target="#xs-components-links-module-ChallengeModule-e143426dbb89f5eb4f5accfe8b9c6fe824d4c957b01fe01407f09698a4298beb1f39880f4f0cea28fa6a65339238f23120994e3ba2a50252e0b1ee37155a2147"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ChallengeModule-e143426dbb89f5eb4f5accfe8b9c6fe824d4c957b01fe01407f09698a4298beb1f39880f4f0cea28fa6a65339238f23120994e3ba2a50252e0b1ee37155a2147"' :
                                            'id="xs-components-links-module-ChallengeModule-e143426dbb89f5eb4f5accfe8b9c6fe824d4c957b01fe01407f09698a4298beb1f39880f4f0cea28fa6a65339238f23120994e3ba2a50252e0b1ee37155a2147"' }>
                                            <li class="link">
                                                <a href="components/ChallengeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ChallengeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ChallengeHeaderComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ChallengeHeaderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ChallengeInfoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ChallengeInfoComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ChallengeModule-e143426dbb89f5eb4f5accfe8b9c6fe824d4c957b01fe01407f09698a4298beb1f39880f4f0cea28fa6a65339238f23120994e3ba2a50252e0b1ee37155a2147"' : 'data-bs-target="#xs-injectables-links-module-ChallengeModule-e143426dbb89f5eb4f5accfe8b9c6fe824d4c957b01fe01407f09698a4298beb1f39880f4f0cea28fa6a65339238f23120994e3ba2a50252e0b1ee37155a2147"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ChallengeModule-e143426dbb89f5eb4f5accfe8b9c6fe824d4c957b01fe01407f09698a4298beb1f39880f4f0cea28fa6a65339238f23120994e3ba2a50252e0b1ee37155a2147"' :
                                        'id="xs-injectables-links-module-ChallengeModule-e143426dbb89f5eb4f5accfe8b9c6fe824d4c957b01fe01407f09698a4298beb1f39880f4f0cea28fa6a65339238f23120994e3ba2a50252e0b1ee37155a2147"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ChallengeRoutingModule.html" data-type="entity-link" >ChallengeRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/CoreModule.html" data-type="entity-link" >CoreModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-CoreModule-cb46040be1ebd2398da69f1113a2693ba8134784e2f9e8e82e7e821f64a0edd1dae17b6e3f00f5b59f515b570b931a628ca5b80a8b8c5ca6bd9055b40b0610bd"' : 'data-bs-target="#xs-components-links-module-CoreModule-cb46040be1ebd2398da69f1113a2693ba8134784e2f9e8e82e7e821f64a0edd1dae17b6e3f00f5b59f515b570b931a628ca5b80a8b8c5ca6bd9055b40b0610bd"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-CoreModule-cb46040be1ebd2398da69f1113a2693ba8134784e2f9e8e82e7e821f64a0edd1dae17b6e3f00f5b59f515b570b931a628ca5b80a8b8c5ca6bd9055b40b0610bd"' :
                                            'id="xs-components-links-module-CoreModule-cb46040be1ebd2398da69f1113a2693ba8134784e2f9e8e82e7e821f64a0edd1dae17b6e3f00f5b59f515b570b931a628ca5b80a8b8c5ca6bd9055b40b0610bd"' }>
                                            <li class="link">
                                                <a href="components/FooterComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FooterComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HeaderComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HeaderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MainComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MainComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MainMenuComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MainMenuComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MobileNavComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MobileNavComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/CoreRoutingModule.html" data-type="entity-link" >CoreRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/I18nModule.html" data-type="entity-link" >I18nModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ModalsModule.html" data-type="entity-link" >ModalsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-ModalsModule-f116f8eb24d14825195a18bd25efe98cb01a065d1a39bc837192c66e58a527b70506a588db715b583495d07cc5b14aadf116820789a453db33c2f135605c36b4"' : 'data-bs-target="#xs-components-links-module-ModalsModule-f116f8eb24d14825195a18bd25efe98cb01a065d1a39bc837192c66e58a527b70506a588db715b583495d07cc5b14aadf116820789a453db33c2f135605c36b4"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ModalsModule-f116f8eb24d14825195a18bd25efe98cb01a065d1a39bc837192c66e58a527b70506a588db715b583495d07cc5b14aadf116820789a453db33c2f135605c36b4"' :
                                            'id="xs-components-links-module-ModalsModule-f116f8eb24d14825195a18bd25efe98cb01a065d1a39bc837192c66e58a527b70506a588db715b583495d07cc5b14aadf116820789a453db33c2f135605c36b4"' }>
                                            <li class="link">
                                                <a href="components/FiltersModalComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FiltersModalComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoginModalComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoginModalComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegisterModalComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RegisterModalComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RestrictedModalComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RestrictedModalComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SendSolutionModalComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SendSolutionModalComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ProfileModule.html" data-type="entity-link" >ProfileModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-ProfileModule-f1bb3872eae3c776ac27e9a834c15732b85453befba9a7c879af3ee753bc7f5c755a77840d816f30a95c727ae9996d606e86ee73467bad33fd22b3ed1bb3d9c8"' : 'data-bs-target="#xs-components-links-module-ProfileModule-f1bb3872eae3c776ac27e9a834c15732b85453befba9a7c879af3ee753bc7f5c755a77840d816f30a95c727ae9996d606e86ee73467bad33fd22b3ed1bb3d9c8"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ProfileModule-f1bb3872eae3c776ac27e9a834c15732b85453befba9a7c879af3ee753bc7f5c755a77840d816f30a95c727ae9996d606e86ee73467bad33fd22b3ed1bb3d9c8"' :
                                            'id="xs-components-links-module-ProfileModule-f1bb3872eae3c776ac27e9a834c15732b85453befba9a7c879af3ee753bc7f5c755a77840d816f30a95c727ae9996d606e86ee73467bad33fd22b3ed1bb3d9c8"' }>
                                            <li class="link">
                                                <a href="components/ProfileComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProfileComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProfileHeaderComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProfileHeaderComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ProfileRoutingModule.html" data-type="entity-link" >ProfileRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/SharedComponentsModule.html" data-type="entity-link" >SharedComponentsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-SharedComponentsModule-7235a248afb3bc4700a46d7b0191027418ab1ea001c0f813a1f68c04ccec0ba32c0637289b7b47d1f74d54d059e2081a9435e1175756971ace2dfaa5fb2acd39"' : 'data-bs-target="#xs-components-links-module-SharedComponentsModule-7235a248afb3bc4700a46d7b0191027418ab1ea001c0f813a1f68c04ccec0ba32c0637289b7b47d1f74d54d059e2081a9435e1175756971ace2dfaa5fb2acd39"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SharedComponentsModule-7235a248afb3bc4700a46d7b0191027418ab1ea001c0f813a1f68c04ccec0ba32c0637289b7b47d1f74d54d059e2081a9435e1175756971ace2dfaa5fb2acd39"' :
                                            'id="xs-components-links-module-SharedComponentsModule-7235a248afb3bc4700a46d7b0191027418ab1ea001c0f813a1f68c04ccec0ba32c0637289b7b47d1f74d54d059e2081a9435e1175756971ace2dfaa5fb2acd39"' }>
                                            <li class="link">
                                                <a href="components/BreadcrumbComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BreadcrumbComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ChallengeCardComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ChallengeCardComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PaginationComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PaginationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ResourceCardComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ResourceCardComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SolutionComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SolutionComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/StarterModule.html" data-type="entity-link" >StarterModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-StarterModule-c644cb2fcffae6c041471d56df0b39bb03ade9cdb970ff5f1c764d967e980efe46791f7217d3419ba4ef96a3420d9414a6cb15654f2a6a791f890f6cd35f6bf0"' : 'data-bs-target="#xs-components-links-module-StarterModule-c644cb2fcffae6c041471d56df0b39bb03ade9cdb970ff5f1c764d967e980efe46791f7217d3419ba4ef96a3420d9414a6cb15654f2a6a791f890f6cd35f6bf0"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-StarterModule-c644cb2fcffae6c041471d56df0b39bb03ade9cdb970ff5f1c764d967e980efe46791f7217d3419ba4ef96a3420d9414a6cb15654f2a6a791f890f6cd35f6bf0"' :
                                            'id="xs-components-links-module-StarterModule-c644cb2fcffae6c041471d56df0b39bb03ade9cdb970ff5f1c764d967e980efe46791f7217d3419ba4ef96a3420d9414a6cb15654f2a6a791f890f6cd35f6bf0"' }>
                                            <li class="link">
                                                <a href="components/StarterComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StarterComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StarterFiltersComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StarterFiltersComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-StarterModule-c644cb2fcffae6c041471d56df0b39bb03ade9cdb970ff5f1c764d967e980efe46791f7217d3419ba4ef96a3420d9414a6cb15654f2a6a791f890f6cd35f6bf0"' : 'data-bs-target="#xs-injectables-links-module-StarterModule-c644cb2fcffae6c041471d56df0b39bb03ade9cdb970ff5f1c764d967e980efe46791f7217d3419ba4ef96a3420d9414a6cb15654f2a6a791f890f6cd35f6bf0"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-StarterModule-c644cb2fcffae6c041471d56df0b39bb03ade9cdb970ff5f1c764d967e980efe46791f7217d3419ba4ef96a3420d9414a6cb15654f2a6a791f890f6cd35f6bf0"' :
                                        'id="xs-injectables-links-module-StarterModule-c644cb2fcffae6c041471d56df0b39bb03ade9cdb970ff5f1c764d967e980efe46791f7217d3419ba4ef96a3420d9414a6cb15654f2a6a791f890f6cd35f6bf0"' }>
                                        <li class="link">
                                            <a href="injectables/ChallengeService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ChallengeService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/StarterRoutingModule.html" data-type="entity-link" >StarterRoutingModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/Challenge.html" data-type="entity-link" >Challenge</a>
                            </li>
                            <li class="link">
                                <a href="classes/ChallengeDetails.html" data-type="entity-link" >ChallengeDetails</a>
                            </li>
                            <li class="link">
                                <a href="classes/DataChallenge.html" data-type="entity-link" >DataChallenge</a>
                            </li>
                            <li class="link">
                                <a href="classes/Example.html" data-type="entity-link" >Example</a>
                            </li>
                            <li class="link">
                                <a href="classes/FilterChallenge.html" data-type="entity-link" >FilterChallenge</a>
                            </li>
                            <li class="link">
                                <a href="classes/Language.html" data-type="entity-link" >Language</a>
                            </li>
                            <li class="link">
                                <a href="classes/Resource.html" data-type="entity-link" >Resource</a>
                            </li>
                            <li class="link">
                                <a href="classes/Solution.html" data-type="entity-link" >Solution</a>
                            </li>
                            <li class="link">
                                <a href="classes/User.html" data-type="entity-link" >User</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BreadcrumbService.html" data-type="entity-link" >BreadcrumbService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ChallengeService.html" data-type="entity-link" >ChallengeService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SolutionService.html" data-type="entity-link" >SolutionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StarterService.html" data-type="entity-link" >StarterService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interceptors-links"' :
                            'data-bs-target="#xs-interceptors-links"' }>
                            <span class="icon ion-ios-swap"></span>
                            <span>Interceptors</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="interceptors-links"' : 'id="xs-interceptors-links"' }>
                            <li class="link">
                                <a href="interceptors/JwtInterceptor.html" data-type="entity-link" >JwtInterceptor</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/Breadcrumb.html" data-type="entity-link" >Breadcrumb</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/loginResponse.html" data-type="entity-link" >loginResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserResponse.html" data-type="entity-link" >UserResponse</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});