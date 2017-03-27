import Modal from '../Modal.vue'
import Pagination from '../Pagination.vue'
import CampaignTag from '../CampaignTag.vue'
import ColumnSort from '../ColumnSort.vue'
import campaignService from '../../../services/campaign'

let tableMixin = {
    data: function() {
        return {
            sortKey: 'updated_at',
            reverse: false,
            showModal: false,
            selectedCampaignId: null,
            baseUrl: Application.globals.baseUrl
        }
    },
    components: {
        Modal,
        Pagination,
        CampaignTag,
        ColumnSort
    },
    props: {
        campaigns: {
            type: Array,
            required: true
        },
        config: {
            type: Array,
            required: true
        },
        loading: {
            type: Boolean,
            default: false
        },
        templating: {
            type: Boolean,
            default: false
        },
        tags: {
            type: Array
        },
        terms: {
            type: Array
        },
        type: {
            type: String,
            required: true
        }
    },
    computed: {
        showTags: function() {
            return this.config.enable_tagging;
        },
        enableLocking: function() {
            return this.config.locking;
        },
        search: function() {
            return this.tags.concat(this.terms).join('~~').toLowerCase().split('~~');
        }
    },
    methods: {
        addSearchTag: function(tag) {
            if (this.config.enable_search === true) {
                this.$emit('add-search-tag', tag);
            }
        },
        askToDeleteCampaign: function(campaignId) {
            this.selectedCampaignId = campaignId;
            this.showModal = true;
        },
        changePage: function(page) {
            this.$emit('change-page', page, this.type);
        },
        confirmDeleteCampaign: function() {
            $.post(Application.globals.baseUrl + '/campaign/delete', {
                campaign_id: this.selectedCampaignId
            }, function(campaigns) {
                this.selectedCampaignId = null;
                this.showModal = false;
                this.$emit('refresh-campaigns', this.type);
            }.bind(this), 'json');
        },
        highlightTag: function(tag) {
            if (this.config.search_settings.highlight_matches === true) {
                if (this.tags.indexOf(tag) > -1) {
                    return true;
                }
                for (let i = 0; i < this.terms.length; i++) {
                    if (this.terms[i].length > 0) {
                        let re = new RegExp('('+this.terms[i]+')', 'gi');
                        if (re.test(tag)) {
                            return true;
                        }
                    }
                }
            }
            return false;
        },
        sortBy: function(sortKey) {
            this.reverse = (this.sortKey == sortKey) ? !this.reverse : false;
            this.$emit('apply-sort', sortKey, this.reverse == true ? 'asc' : 'desc', this.type, (this.sortKey != sortKey));
            this.sortKey = sortKey;
        },
        prepareOutput: function(value, field) {
            let search = this.terms;
            if (this.config.search_settings.highlight_matches === true && this.config.search_settings.fields_to_search.indexOf(field) > -1) {
                for (let i = 0; i < search.length; i++) {
                    value = value.replace(new RegExp('('+search[i]+')', 'gi'), '%%%$1###');
                }
                value = value.replace(/%%%/g, '<span class="highlight">');
                value = value.replace(/###/g, '</span>');
            }
            return value;
        },
        lockCampaign: function(campaign_id, page) {
            let data = {
                campaign_id: campaign_id
            };
            let lockCampaign = Application.utils.doAjax('/campaign/force-lock', {data: data});
            let vm = this;
            lockCampaign.done(function(data) {
                vm.$emit('change-page', page, vm.type);
            });
        },
        unlockCampaign: function(campaign_id, page) {
            let data = {
                campaign_id: campaign_id
            };
            let unlockCampaign = Application.utils.doAjax('/campaign/unlock-forced', {data: data});
            let vm = this;
            unlockCampaign.done(function(data) {
                vm.$emit('change-page', page, vm.type);
            });
        },
        // Clone Campaign
        cloneCampaign (event) {
            let campaignId = $(event.target).parents("[data-campaign]").attr("data-campaign");
            let _this = this;

            if( campaignId ){
                // Show spinner
                this.loading = true;

                campaignService.cloneCampaign(campaignId)
                    .then((response) => {
                        if( response.campaign_id && response.campaign_id != campaignId ){
                            window.location.href = Application.globals.baseUrl + "/campaign/edit/" + response.campaign_id;
                        }
                    })
                    .catch((error) => {
                        Application.utils.alert.display("Error:","An error occurred while trying to clone the campaign, please try again later.","danger");
                    });
            }
        },
        // Go to edit campaign
        editCampaign (event) {
            let campaignId = $(event.target).parents("[data-campaign]").attr("data-campaign");

            if( campaignId ){
                window.location.href = Application.globals.baseUrl + "/campaign/edit/" + campaignId;
            }
        },
    }
};

export default tableMixin;