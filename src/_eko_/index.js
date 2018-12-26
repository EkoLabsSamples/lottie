'use strict';

import ekoStudioApp from './js/app';

// In es6 modules you're not supposed to override the variable 
// used as the import target.
import developerCode from '../js/app';

// Normalize developer's app.js in case its a function
let developerApp;
if (typeof developerCode === 'function') {
    developerApp = {
        onInit: developerCode
    };
} else {
    developerApp = developerCode;
}

// Expose variables on ctx so will be available for sub apps.
function addVariablesToCtx(ctx) {
    return ekoStudioApp.addVariablesToCtx(ctx);
}

function safeCall(f) {
    if (typeof f === 'function') {
        const args = Array.prototype.slice.call(arguments, 1);
        return f.apply(null, args);
    }
    return true;
}


// Project essentials.
export default {
    // The onLoad hook runs at the loading of the html page that loads the project
    // Here you can perform actions that you need to run before the init of the player
    // If your hook is doing anything asynchronous you need to return a promise. You can use the when.js libaray
    // that is exposed on the ctx object (e.g. return ctx.when.promise())
    onLoad: function(ctx) {
        ctx = addVariablesToCtx(ctx);

        return ekoStudioApp.onLoad(ctx).then(function() {
            return safeCall(developerApp.onLoad, ctx);
        });
    },

    // The onPlayerInit hook runs after the player was loaded.
    // Here you can load all the resources needed for playing the project
    // This function should end by adding a node to the playlist
    // If your hook is doing anything asynchronous you need to return a promise. You can use the when.js libaray
    // that is exposed on the ctx object (e.g. return ctx.when.promise())
    onPlayerInit: function(ctx) {
        return ekoStudioApp.onPlayerInit(ctx).then(function() {
            // if the developer implemented onInit it is called with two arguments
            if (typeof developerApp.onInit === 'function') {
                return safeCall(developerApp.onInit, ctx.player, ctx);
            }
            // if the developer provided onPlayerInit it is called with the context for backward compatibility
            return safeCall(developerApp.onPlayerInit, ctx);
        });
    },

    studioPlayerOptions: ekoStudioApp.playerOptions,
    devPlayerOptions: developerApp.playerOptions
};
