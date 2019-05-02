import playerOptions from '../config/playerOptions.json';
import EkoUIComponents from "EkoUIComponents";
import buttonAnimation from "./chug.json";
import timerAnimation from "./timer.json";
import Lottie from 'lottie-web';

export default {
    onLoad: function(ctx) { },

    onInit: function(player, ctx) {
        player.ui.override(/button_.*/, EkoUIComponents.EkoLottieDecisionButton, {
            lottieData: buttonAnimation,
            Lottie: Lottie
        });

        player.ui.override(/timer.*/, EkoUIComponents.EkoLottieTimer, {
            lottieData: timerAnimation,
            Lottie: Lottie
        });
    },

    playerOptions
};
