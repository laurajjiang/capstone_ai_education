import React from "react";

function Tf_VIS() {
  return (
        <section>
        <h2>The Visor</h2>
        <p>
          Let's take a look at the first. Calling <code>tfvis.visor()</code> will create a visor if it doesn't exist or
          return
          the existing one. Click the button below to show the
          <em>visor.</em>
        </p>
        <button id='show-visor'>Show Visor</button>
        <p>
          Notice the panel that is now displayed on the right. It hovers over your pages content and shouldn't disturb
          the flow of
          your page's DOM Elements. You can see a few controls for showing or hiding the visor, but by default it also
          supports
          the following keyboard shortcuts:
          <ul>
            <li>
              <strong>`</strong> (backtick): Shows or hides the visor</li>
            <li>
              <strong>~</strong> (tilde, shift+backtick): Toggles betweeen the two sizes the visor supports</li>
          </ul>
          The API allows you to disable (unbind) these keyboard shortcuts.
        </p>
        </section>
  );
}

export default Tf_VIS;