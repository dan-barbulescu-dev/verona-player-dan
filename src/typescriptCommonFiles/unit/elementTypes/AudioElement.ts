import {UnitElement} from '../UnitElement.js';
import {Property, Properties} from '../Properties.js';
import {PropertiesValue, UnitElementData, UnitPageData, UnitData} from '../../models/Data.js';

export class AudioElement extends UnitElement {

    /* ---------- Material Icons (encoded as base64) ------------------

    https://material.io/tools/icons/?style=baseline

    License according to material.io : https://www.apache.org/licenses/LICENSE-2.0.html

    */
    private playIcon24px: string = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAQAAABKfvVzAAAAU0lEQVR4AWMAgVGwgUGANA3/Gd4z5JOkAQz3MygQrQEO64nVgIDnGRyI1YCA/YQC4T8GvM8QQJqGB6RpmECKky6Q5ukGUoL1ACkR94GhgLLENwoAu8xMerZ59JQAAAAASUVORK5CYII=`;
    private pauseIcon24px: string = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAIUlEQVR4AWMY2WAU/EfGhORHLRi1YNSCUQtGLRjeYBQAAMImb5Eus0ZYAAAAAElFTkSuQmCC`;

    /* --------------------------------------------------------------- */

    constructor(public elementID: string, public pageHTMLElementID: string, src: string)
    {
        super(elementID, pageHTMLElementID);

        this.properties.addProperty('type', {
            value: 'audio',
            userAdjustable: false,
            propertyType: 'text',
            hidden: false,
            caption: 'Type',
            tooltip: 'Was für ein Element dieses Element ist.'
        });

        this.properties.addProperty('src', {
            value: src,
            userAdjustable: false,
            propertyType: 'text',
            hidden: true,
            caption: 'Source'
        });

        this.properties.addProperty('autoplay', {
            value: 'false',
            userAdjustable: true,
            propertyType: 'boolean',
            hidden: false,
            caption: 'Autoplay',
            tooltip: 'Soll das Audio automatisch gespielt werden?'
        });


        // todo - customizable volume
        /*
        this.properties.addProperty('defaultVolume', {
            value: '0.2',
            userAdjustable: true,
            propertyType: 'text',
            hidden: false,
            caption: 'Standardlautstärke',
            tooltip: 'Die Standardlautstärke des Audios'
        });
        */


        this.properties.addPropertyRenderer('autoplay', 'AudioRenderer', (propertyValue: string) => {
            // autoplay is now handled by jQuery('#' + this.elementID + '_audio').on('load'), lower in this file
            /*


            const audioHTMLElement = (document.getElementById(this.elementID + '_audio') as HTMLAudioElement);
            if (propertyValue === 'true') {
                audioHTMLElement.setAttribute('autoplay', 'true');
            }
            else
            {
                if (audioHTMLElement.hasAttribute('autoplay')) {
                    audioHTMLElement.removeAttribute('autoplay');
                }
            }
            */

        });

        this.properties.addProperty('hasControl', {
            value: 'true',
            userAdjustable: true,
            propertyType: 'boolean',
            hidden: false,
            caption: 'Steuerung',
            tooltip: 'Ob jemand das Audio-Element steuern kann'
        });

        this.properties.addPropertyRenderer('hasControl', 'audioRenderer', (propertyValue: string) => {
            const disabledAudioDiv = elementID + '_audio_controls';
            if (propertyValue === 'true')
            {
                (document.getElementById(disabledAudioDiv) as HTMLInputElement).style.display = 'initial';
            }
            else
            {
                (document.getElementById(disabledAudioDiv) as HTMLInputElement).style.display = 'none';
            }
        });

        this.properties.addProperty('playOnlyOnce', {
            value: 'true',
            userAdjustable: true,
            propertyType: 'boolean',
            hidden: false,
            caption: 'Nur einmal gespielt',
            tooltip: ''
        });

        this.properties.addPropertyRenderer('playOnlyOnce', 'audioRenderer', (propertyValue: string) => {
        });

        this.properties.addProperty('alreadyPlayed', {
            value: 'false',
            userAdjustable: false,
            propertyType: 'boolean',
            hidden: true,
            caption: 'alreadyPlayed',
            tooltip: ''
        });

        this.properties.addPropertyRenderer('alreadyPlayed', 'audioRenderer', (propertyValue: string) => {
            if (propertyValue === 'true') {
                const audioElement = document.getElementById(this.elementID + '_audio') as HTMLAudioElement;
                const audioElementVisualLocation = document.getElementById(this.elementID + '_audio_visualLocation') as HTMLAudioElement;
                const audioElementTextLocation = document.getElementById(this.elementID + '_audio_textLocation') as HTMLAudioElement;

                audioElementVisualLocation.setAttribute('max', '100');
                audioElementVisualLocation.setAttribute('value', '100');

                audioElementTextLocation.innerHTML = 'Audio wurde gespielt.';
            }
        });

        // remove inherited properties that this element type does not use
        this.properties.removeProperty('style');
        this.properties.removeProperty('font-family');
        this.properties.removeProperty('font-size');
        this.properties.removeProperty('color');
        this.properties.removeProperty('background-color');
    }

    drawElement()
    {
        // idea on how to make the audio element not reachable by tab based on stackoverflow
        // https://stackoverflow.com/a/5192919
        // Original answer by: https://stackoverflow.com/users/399908/martin-hennings
        // Edited by: https://stackoverflow.com/users/399908/martin-hennings , https://stackoverflow.com/users/1317805/james-donnelly
        // License: cc by-sa 3.0

        const elementHTML = `
                    <div class="itemElement" id="${this.elementID}" style="${this.elementCommonStyle}; overflow: hidden;">
                            <audio src="${this.properties.getPropertyValue('src')}"
                                   id="${this.elementID}_audio"
                                   style="width: 100%; display: none;"
                                   tabindex="-1"
                                   controls controlsList="nodownload">
                            </audio>
                            <div id="${this.elementID}_customAudio">
                                <span id="${this.elementID}_audio_controls" style="display: none">
                                <img id="${this.elementID}_audio_btnPlay" src="${this.playIcon24px}" style="display: none; cursor: pointer; position: relative; top: 6px;">
                                <img id="${this.elementID}_audio_btnPause" src="${this.pauseIcon24px}" style="display: none; cursor: pointer; position: relative; top: 6px;">
                                </span>
                                <meter id="${this.elementID}_audio_visualLocation" min="0" max="100" value="0" style="width: 60%"></meter>
                                <span id="${this.elementID}_audio_textLocation" style="width: 20%"></span>
                            </div>
                    </div>`;

       const pageHTMLElement = this.getPageHTMLElement();
       if (pageHTMLElement !== null)
       {
        pageHTMLElement.insertAdjacentHTML('beforeend', elementHTML);

        if ((this.width === -1) && (this.height === -1))
        {
            this.properties.renderProperties(['width', 'height']);

            jQuery('#' + this.elementID + '_audio').on('load', () => {
                // https://api.jquery.com/load-event/
                // adjust height and width after loading audio
                this.updateSizePropertiesBasedOn(this.pageHTMLElementID, this.elementID);
                this.properties.renderProperty('height');
                this.properties.renderProperty('width');
            });
        }
        else
        {
            this.properties.renderProperties();
        }

        // add audio events
        const audioElement = document.getElementById(this.elementID + '_audio') as HTMLAudioElement;
        const audioElementVisualLocation = document.getElementById(this.elementID + '_audio_visualLocation') as HTMLAudioElement;
        const audioElementTextLocation = document.getElementById(this.elementID + '_audio_textLocation') as HTMLAudioElement;

        const playButton = document.getElementById(this.elementID + '_audio_btnPlay') as HTMLImageElement;
        const pauseButton = document.getElementById(this.elementID + '_audio_btnPause') as HTMLImageElement;

        const showAudioLocation = () => {
            if (audioElement.duration > 0) {
                audioElementVisualLocation.setAttribute('value', audioElement.currentTime.toString());

                const currentLocationMinutesAsInt: number = Math.floor(audioElement.currentTime / 60);
                let currentLocationMinutesAsString: string = currentLocationMinutesAsInt.toString();
                // if (currentLocationMinutesAsInt < 10) { currentLocationMinutesAsString = '0' + currentLocationMinutesAsString; }

                const currentLocationSecondsAsInt = Math.floor(audioElement.currentTime % 60);
                let currentLocationSecondsAsString: string = currentLocationSecondsAsInt.toString();
                if (currentLocationSecondsAsInt < 10) { currentLocationSecondsAsString = '0' + currentLocationSecondsAsString; }

                const totalDurationMinutesAsInt: number = Math.floor(audioElement.duration / 60);
                let totalDurationMinutesAsString: string = totalDurationMinutesAsInt.toString();
                // if (totalDurationMinutesAsInt < 10) { totalDurationMinutesAsString = '0' + totalDurationMinutesAsString; }

                const totalDurationSecondsAsInt = Math.floor(audioElement.duration % 60);
                let totalDurationSecondsAsString: string = totalDurationSecondsAsInt.toString();
                if (totalDurationSecondsAsInt < 10) { totalDurationSecondsAsString = '0' + totalDurationSecondsAsString; }

                const textLocation =  currentLocationMinutesAsString + ':' + currentLocationSecondsAsString + ' / ' +
                                        totalDurationMinutesAsString + ':' + totalDurationSecondsAsString;

                audioElementTextLocation.innerHTML =  textLocation;
            }
        };

        audioElement.onloadeddata = () => {

            playButton.style.display = 'initial';
            pauseButton.style.display = 'none';

            audioElementVisualLocation.setAttribute('max', audioElement.duration.toString());
            audioElementVisualLocation.setAttribute('value', '0');

            // todo - customizable volume

            /*
            // set volume
            let defaultVolume: number = parseFloat(this.getPropertyValue('defaultVolume'));
            if (defaultVolume > 1) {
                defaultVolume = 1;
            }
            if (defaultVolume < 0) {
                defaultVolume = 1;
            }

            // audioElement.volume = defaultVolume;             // todo -customizable volume
            console.log('Set audio volume to: ' + defaultVolume);
            */
            // end of setting audio volume

            if (this.getPropertyValue('autoplay') === 'true')
            {
                audioElement.play();

                window.dispatchEvent(new CustomEvent('IQB.unit.audioElementStarted', {
                    detail: {'elementID': this.getElementID()}
                }));
            }

            showAudioLocation();
        };

        audioElement.addEventListener('timeupdate', () => {
            showAudioLocation();
        });

        audioElement.onended = () => {
            playButton.style.display = 'initial';
            pauseButton.style.display = 'none';

            window.dispatchEvent(new CustomEvent('IQB.unit.audioElementEnded', {
                detail: {'elementID': this.getElementID()}
            }));
        };
        // finished adding audio events

        // add play and pause functionality
        playButton.addEventListener('click', () => {
            playButton.style.display = 'none';
            pauseButton.style.display = 'initial';
            audioElement.play();
        });

        pauseButton.addEventListener('click', () => {
            pauseButton.style.display = 'none';
            playButton.style.display = 'initial';
            audioElement.pause();
        });

        // todo - customizable volume
        /*
        // reach to unit volume changes
        window.addEventListener('IQB.unit.newVolume', (e) => {
            const newVolume = e.detail.newVolume;

            // todo - customizable volume
            // audioElement.volume = parseFloat(newVolume);

            this.setPropertyValue('defaultVolume', newVolume);
         });
        // finished the reaction to unit volume changes
        */

        this.dispatchNewElementDrawnEvent();
       }
    }

}
