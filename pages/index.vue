<template>
  <div class="w-full h-screen overflow-hidden">
    <div class="h-full w-full flex flex-col overflow-hidden px-4 lg:container lg:px-0"
    > <div class="h-fit flex flex-col w-full justify-center items-center">
        <div class="flex w-full mt-4">
          <span
            class="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600"     >
            @
          </span>
          <input
            type="text"
            id="website-admin"
            class="rounded-none bg-gray-50 border border-gray-300 text-gray-900 focus:ring-0 focus:border-none block flex-1 min-w-0 w-full text-sm p-4"
            placeholder="Hey Chat GPT, write me a poem on life. (Max 100 characters)"
            v-model="message"
            maxlength="100"          
          />
          <span
            @click="send()"
            class="inline-flex items-center cursor-pointer px-3 text-sm text-gray-900 bg-gray-200 border border-l-0 border-gray-300 rounded-r-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600"
          >
            Enter
          </span>
        </div>
      </div>
      <div class="chat-container">
        <div class="chat-box">
          <div v-for="(c, index) in conversations" :key="index" class="message">
            <div class="flex flex-row w-full justify-start items-start space-x-2 p-2 mt-4">
              <p class="h-8 w-8 flex justify-center items-center rounded-full bg-gray-300 text-sm">
                U
              </p>
              <div class="message-text">{{ c.q }}</div>
            </div>
            <div class="flex flex-row justify-start items-center space-x-2 bg-gray-100 p-2 rounded">
              <div class="message-text">{{ c.a }}</div>
            </div>
          </div>
         <!-- <div class="chat-container">
            <div class="chat-box">
              <div v-for="(c, index) in conversations" :key="index" class="message">
                <div class="user-message">
                  <p class="user-avatar">U</p>
                  <div class="message-text">{{ c.q }}</div>
                </div>
                <div class="assistant-message">
                  <div class="message-text">{{ c.a }}</div>
                </div>
              </div>
            </div>
          </div> -->
          <div v-if="isLoading">
            <lottie-player
              src="https://assets3.lottiefiles.com/packages/lf20_SCdC0F.json"
              background="transparent"
              speed="1"
              class="h-24 w-24"
              loop
              autoplay
            ></lottie-player>
          </div>
        </div>
      </div>
      <div class="h-fit w-full flex flex-row space-x-3 justify-center items-center text-sm font-light pb-2 mt-4">
        <p>Built with Nuxt3</p>
        <p>|</p>
        <a
          href="https://github.com/paragchirde/Nuxt3-ChatGPT"
          target="_blank"
          rel="noopener noreferrer"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 2048 2048"
          >
            <path
              fill="currentColor"
              d="M1024 25q141 0 272 36t244 104t207 160t161 207t103 245t37 272q0 165-50 318t-143 281t-221 224t-286 149q-3 1-9 1t-9 1q-24 0-38-14t-14-37v-140q0-69 1-141q0-51-15-103t-54-87q116-13 203-47t146-96t88-150t30-212q0-78-26-147t-79-128q11-28 16-58t5-60q0-39-8-77t-23-76q-5-2-11-2t-11 0q-32 0-67 10t-69 26t-67 35t-57 36q-125-35-256-35t-256 35q-25-17-57-36t-66-34t-70-26t-67-11h-11q-6 0-11 2q-14 37-22 75t-9 78q0 30 5 60t16 58q-53 58-79 127t-26 148q0 122 29 211t88 150t146 97t203 48q-29 26-44 62t-21 75q-27 13-57 20t-60 7q-64 0-106-30t-75-82q-12-19-29-38t-37-34t-43-24t-48-10h-12q-8 0-15 3t-14 6t-6 10q0 12 14 23t23 18l3 2q22 17 38 32t30 33t23 38t23 47q34 78 95 113t147 36q26 0 52-3t52-9v174q0 24-14 38t-39 14h-8q-5 0-9-2q-157-51-286-147t-221-225t-142-282t-51-318q0-141 36-272t104-244t160-207t207-161T752 62t272-37z"
            /></svg
        ></a>
      </div>
    </div>
  </div>
</template>

<script>
import { useMouse } from '@vueuse/core'
import { ref, reactive, computed } from 'vue'
const { x, y } = useMouse()
export default {
/**
 * Returns the head object for the Vue component.
 * @returns {Object} The head object.
 */
head() {
  return {
    meta: [
      // Set the Open Graph type
      { hid: 'og-type', property: 'og:type', content: 'website' },
      // Set the Open Graph title
      { hid: 'og-title', property: 'og:title', content: 'Nuxt3 ChatGPT API' },
      // Set the Open Graph description
      {
        hid: 'og-desc',
        property: 'og:description',
        content: 'Starter repo for ChatGPT API using Nuxt 3'
      },
      // Set the Open Graph URL
      {
        hid: 'og-url',
        property: 'og:url',
        content: 'https://github.com/paragchirde/Nuxt3-ChatGPT'
      }
    ]
  }
},
/**
 * Returns an object containing the initial data for the component.
 * @returns {Object} The initial data object.
 */
data() {
  return {
    // The user's message input
    message: '',
    // The response from the server
    response: '',
    // The list of conversations
    conversations: [],
    // The runtime configuration
    runtimeConfig: useRuntimeConfig(),
    // Flag indicating if a request is loading
    isLoading: false,
    // Flag indicating if an error occurred
    isError: false
  }
},
   
  methods: {
/**
 * Sends a message to the OpenAI chat API and retrieves the response.
 * Updates the state with the response and adds the conversation to the history.
 * @throws {Error} If there is an error during the API call.
 */
async send() {
  // Set loading state to true
  this.isLoading = true;

  try {
    // Make a POST request to the OpenAI chat API
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.runtimeConfig.public.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'system', content: 'tu es un spécialiste de recherche en documentation techniques qui fourni des liens sur des lignes séparées' },
        { role: 'system', content: 'tu recherches d abord sur https://www.tecnoland.fr, https://manualzz.com/, https://docplayer.fr/' },
        { role: 'user', name: 'example_user', content: 'Convertisseur de pression et de pression différentielle Type 4304 jumo' },
        { role: 'assistant', name: 'example_assistant', content: 'https://www.jumo.fr/web/products/apps/productdetailpage?pdpId=404304' },
        { role: 'user', name: 'example_user', content: 'centrale de mesure pm800' },
        { role: 'assistant', name: 'example_assistant', content: 'https://damrexelprod.blob.core.windows.net/medias/1257edec-0da2-4c95-8de0-9a8995761a01' },
        { role: 'user', content: this.message }],
        temperature: 0,
        max_tokens: 512,
      })
    });

    // Parse the response from the API
    const resp = await res.json();

    // Set loading state to false
    this.isLoading = false;

    // Update the response state
    this.response = resp.choices[0].message.content;

    // Add the conversation to the history
    this.conversations = [
      ...this.conversations,
      { q: this.message, a: this.response }
    ];
  } catch (e) {
    // Set loading state to false
    this.isLoading = false;

    // Set error state to true
    this.isError = true;

    // Log the error message
    console.log('Error: ' + e.message);
  }
}
  }
}
</script>

<style></style>
