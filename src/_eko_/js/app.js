import ivds from './auto_generated/ivds';
import nodes from './auto_generated/nodes';
import ui from '../ui.json';
import settings from '../config/settings.json';
import playerOptions from '../config/playerOptions.json';

let player;
let head = 'node_beginning_2430df';

// Project essentials.
export default {
    settings: settings,

    playerOptions: playerOptions,

    addVariablesToCtx: function(ctx) {
        if (ctx.deepmerge) {
            // Backwards compatibility. We no longer export the playerOptions on the ctx like this way.
            // However, some projects may rely on the studioPlayerOptions being present in the onLoad and onInit hooks
            ctx.playerOptions = ctx.deepmerge(ctx.playerOptions, playerOptions);
        }
        return ctx;
    },

    onPlayerInit: function(ctx) {
        player = ctx.player;

        // Some plugins are async and we need to wait for their promise
        // to resolve before continuing.
        let pluginsPromises = [];
        if (player.rtsPreview && player.rtsPreview.promise) {
            pluginsPromises.push(player.rtsPreview.promise);
        }

        return ctx.when.all(pluginsPromises).then(function() {
            // nodes
            player.repository.add(nodes);

            // decisions
            for (let node of nodes) {
                if (node.data && node.data.decision) {
                    player.decision.add(node.id);
                }
            }

            // Allow overriding the head node using the querystring parameter "headnodeid"
            let headNodeId = window.InterludePlayer && 
                                window.InterludePlayer.environment && 
                                window.InterludePlayer.environment.queryParams &&
                                window.InterludePlayer.environment.queryParams.headnodeid;
            if (headNodeId && player.repository.has(headNodeId)) {
                head = headNodeId;
            }

            // replayNode
            player.control.replayNode = head;

            // RtsPreviewPlugin mapping
            
            // UI
            player.ui.createFromConfig(ui);

            // Add end node or overlay according end screen.
            if (player.end && !player.end.hasNode() && !player.end.hasOverlay()) {
                                    // Set end plugin with end screen overlay.
                    player.end.setOverlay('endscreenForEndPlugin');
                            }

            // Set share button visibility in end screen.
                            if (player.controlbar) {
                    player.controlbar.setOptions({
                        components: {
                            endOverlay: {
                                ctaButton: true ? { type: 'share' } : false
                            }
                        }
                    });
                }
            
            // Add notification if there are uncommitted changes in preview
            
            player.append(head);
        });
    },

    // for backwards compatibility
    onStarted: function() {},
    onEnd: function() {},

    onLoad: function(ctx) {
        return ctx.when();
    }
};