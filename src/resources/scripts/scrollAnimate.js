import "../styles/modules/_scroll-animate.scss";

let instance = null;
class ScrollAnimate {
  constructor() {
    this.elems = document.querySelectorAll(".sa-hidden");
    this.windowHeight = window.innerHeight;

    if (!instance) {
      instance = this;
    }
    this._addEventHandlers();
  }

  _addEventHandlers() {
    setTimeout(() => {
      window.addEventListener("scroll", this._checkPosition());
      window.addEventListener("resize", this);
    }, 0);
  }

  _checkPosition() {
    return () => {
      for (var i = 0; i < this.elems.length; i++) {
        var posFromTop = this.elems[i].getBoundingClientRect().top;

        if (posFromTop - this.windowHeight <= 0) {
          this.elems[i].className = this.elems[i].className.replace("sa-hidden", "sa-fade-in");
        }
      }
    };
  };
};

document.addEventListener("DOMContentLoaded", function(e) {
  new ScrollAnimate();
});