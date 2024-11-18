const fs = require('fs');

const { ChannelType, EmbedBuilder } = require("discord.js");
const { ApexAI } = require("apexify.js");

const personalityContent = fs.readFileSync('Events/AI/Apexify/Personality.txt', 'utf-8');
//const personalityString = personalityContent.split('\n').join(' ');

module.exports = {
    name: "messageCreate",

    async execute(message) {
        try {
            if (message.author.bot) return;

            const aiOptions = {
                voice: {
                  textVoice: {
                      enable: false,
                  },
                },
                imagine: {
                    enable: true,
                    drawTrigger: ["create", "imagine", "رسم"],
                    imageModal: "deliberate_v3.safetensors [afd9d2d4]",
                    numOfImages: 2,
                    nsfw: {
                        enable: false,
                        //keywords: ['first word', 'second word'],
                        deepCheck: false
                    },
                    enhancer: {
                        enable: false,
                        //enhancerModal: 'ESRGAN_4x',
                        //negative_prompt: '',
                        //cfg_scale: 7,
                        //sampler: 'DDIM',
                        //steps: 20,
                        //seed: -1,
                        //imgStyle: 'enhance',
                        //width: 512,
                        //height: 512
                    },
                },
                chat: {
                    enable: true,
                    returnChat: true,
                    chatModal: "gemini-flash",
                    readFiles: true,
                    readImages: true,
                    //instruction: '', // To add instruction for the system to obey
                    //API_KEY: '',
                    lang: 'en',
                    personality: './Short_Personality.txt',
                    memory: {
                        memoryOn: true,
                        id: message.author.id
                    },
                    typeWriting: {
                        enable: false
                    }
                },
                others: {
                    onMention: true,
                    messageType: {
                        type: 'reply'
                        //intialContent: `<@${message.author.id}>,`
                    },
                    //buttons: [row1, row2],
                    keywords: ["help"],
                    keywordResponses: {
                        'help': "I'm here to assist you!"
                    },
                    loader: {
                        enable: false,
                        loadingMessage: "Please wait while I process your request...",
                        loadingTimer: 5000
                    },
                    channel: {
                        enable: true,
                        id: ['430778195789348874', '1155488111766282281', '1097011378956546128']
                    },
                    permissions: {
                        enable: false,
                        //role: ['id1', 'id2'],
                        //permission: ['SendMessages'],
                        blockedUsers: ['794324233861333003', '704846426571669611']
                    }
                }
            };

          await ApexAI(message, aiOptions);

        } catch (error) {
            console.error("An error occurred:", error);
        }
    },
};