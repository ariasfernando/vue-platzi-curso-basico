import _ from 'underscore'

function Library (data) {

    console.log(data);
    this.id = data._id;
    this.name = data.name;
    this.description = data.description;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;

    this.config = {
        templateWidth: data.config.templateWidth,
        templateMobileWidth: data.config.templateMobileWidth,
        templateBackgroundColor: data.config.templatebackgroundColor,
        fontFamily: data.config.fontFamily,
        fontSize: data.config.fontSize,
        fontColor: data.config.fontColor,
        lineHeight: data.config.lineHeight
    };

    let groups = [];

    _.each(data.modules, function(modules, group) {
        groups.push({
            name: group,
            modules: modules
        });
    });

    this.modules = groups;

    return this;
}

module.exports = Library;