# XPChromeExtension
Chrome Extension for XP

# Setting up the extension on local machine
1. open `chrome://extensions/` in chrome
2. Turn on the developer mode
3. Click on `Load unpacked` button and browse `XPChromeExtension` directory, it will add the extension in browser and 
   auto generate an `extension ID`.

4. Now you can open the extension option page in two ways

  1. Click on extension icon in chrome tab bar and pin the newly added `xp-extension`
     Right Click on the `xp-extension` and then click on `options` button
  
  2. open `chrome-extension://<Extension ID>/options/options.html` in browser

5. On option page fill in your `XP Username` and `XP Password` and click on check icon

Note: if you have access to dev enviroment you need to change the login URL in `core/login/login.js` page
