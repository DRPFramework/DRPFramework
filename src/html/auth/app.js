Vue.config.devtools = true;
Vue.prototype.window = window;

const app = new Vue({
  el: '#app',
  data() {
    return {
      show: false,
      errorMessage: null,
      registering: false,
      processing: false,
      email: '',
      username: '',
      password: '',
      password2: '',
    };
  },
  methods: {
    setReady() {
      this.show = true;
    },
    setError(message) {
      this.processing = false;
      this.errorMessage = message;
    },
    setEmail(email) {
      this.email = email;
    },
    toggleMode() {
      this.errorMessage = null;
      this.registering = !this.registering;
    },
    processLoginEnter(event) {
      if (event.key !== 'Enter') return;

      this.processRegistration(false);
    },
    processRegistrationEnter(event) {
      if (event.key !== 'Enter') return;

      this.processRegistration(true);
    },
    processRegistration(register = false) {
      this.errorMessage = null;
      this.processing = true;

      if (register) {
        if (this.email === '' || this.email === null) {
          this.setError('E-Posta girilmedi!');
          return;
        }

        if (this.email.length <= 5) {
          this.setError('E-Posta 5 karakterden fazla olmalı!');
          return;
        }

        if (!this.email.includes('@')) {
          this.setError('Geçerli bir email adresi girin!');
          return;
        }

        if (this.password !== this.password2) {
          this.setError('Girmiş olduğunuz şifre, şifre tekrarı ile uyuşmuyor.');
          return;
        }
      }

      if (this.username === '') {
        this.setError('Kullanıcı adı girilmedi!');
        return;
      }

      if (this.username.length <= 3) {
        this.setError('Kullanıcı adı 3 karakterden fazla olmalı!');
        return;
      }

      if (this.password === '') {
        this.setError('Şifre girilmedi!');
        return;
      }

      if (this.password.length <= 3) {
        this.setError('Şifre 3 karakterden fazla olmalı!');
        return;
      }

      if ('alt' in window) {
        if (this.registering) {
          alt.emit('auth:Try', this.username, this.password, this.email);
          return;
        }
        alt.emit('auth:Try', this.username, this.password);
      }
    },
  },
  mounted() {
    if ('alt' in window) {
      alt.on('auth:Error', this.setError);
      alt.on('auth:SetEmail', this.setEmail);
      alt.on('auth:Ready', this.setReady);
      alt.emit('auth:Ready');
    } else {
      this.setReady();
    }
  },
});
