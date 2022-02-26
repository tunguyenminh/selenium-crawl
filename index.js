const webdriver = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const chromedriver = require("chromedriver");
const fs = require("fs");
const { createDecipher } = require("crypto");

(async function helloSelenium() {
  const options = new chrome.Options();
  options.setUserPreferences({
    profile: { managed_default_content_settings: { geolocation: 2 } },
  });
  options.addArguments("--disable-infobars");
  options.addArguments(
    "--user-agent=Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1"
  );
  const driver = new webdriver.Builder()
    .withCapabilities(webdriver.Capabilities.chrome())
    .build();

  // đăng nhập
  await driver.get("https://facebook.com");
  await driver
    .findElement(webdriver.By.id("email"))
    .sendKeys("tunguyenminh12369@gmail.com");
  await driver.findElement(webdriver.By.id("pass")).sendKeys("tunguyen");
  await driver
    .findElement(
      webdriver.By.xpath(
        "/html/body/div[1]/div[2]/div[1]/div/div/div/div[2]/div/div[1]/form/div[2]/button"
      )
    )
    .submit();
  await driver.sleep(5000);
  // login by cookie
  // const cookie = "cookie: datr=4lQWYhR1tdiqvypd6il3zEOX; sb=4lQWYiNQ2RWwvjrYYFHOPOV7; m_pixel_ratio=1; locale=vi_VN; c_user=100013017486715; xs=16%3ACqRwPme1h8s4_A%3A2%3A1645630921%3A-1%3A12649; wd=1348x924; fr=0MTRaslsTkKdxWY9J.AWXF6BqU4VWdEtmlcFye3vljiuc.BiFlTi.7Y.AAA.0.0.BiFlXM.AWUbk3a7XjY"
  // let script = 'javascript:void(function(){ function setCookie(t) { var list = t.split("; "); console.log(list); for (var i = list.length - 1; i >= 0; i--) { var cname = list[i].split("=")[0]; var cvalue = list[i].split("=")[1]; var d = new Date(); d.setTime(d.getTime() + (7*24*60*60*1000)); var expires = ";domain=.facebook.com;expires="+ d.toUTCString(); document.cookie = cname + "=" + cvalue + "; " + expires; } } function hex2a(hex) { var str = ""; for (var i = 0; i < hex.length; i += 2) { var v = parseInt(hex.substr(i, 2), 16); if (v) str += String.fromCharCode(v); } return str; } setCookie("' + cookie + '"); location.href = "https://facebook.com"; })();'
  // driver.executeScript(script)

  // await driver.findElement(webdriver.By.xpath("/html/body/div[1]/div/div[2]/div[1]/div/div[2]/div/div[3]/form/div[5]/div[1]/button")).click();

  // lấy bài viết thay link
  await driver.get(
    "https://m.facebook.com/beatvn.network/photos/a.1859759174341435/3222731854710820"
  );
  // await driver.sleep(7000);
  // ấn màn hình tắt thông báo
  // await driver.findElement(webdriver.By.xpath("/html/body/div[1]/div/div[3]/div[1]/div/div/div[2]/div/div/div[1]/i")).click()
  // await driver.findElement(webdriver.By.xpath("/html/body/div[5]")).click();
  await driver.sleep(2000);
  let commentLength = 0;

  while (true) {
    await driver.sleep(2000);
    await driver
      .findElement(webdriver.By.id("see_next_3222731944710811"))
      .click();
    const commentsGot = await driver.findElements(
      webdriver.By.className("_2b06")
    );
    if (commentLength === commentsGot.length) break;
    commentLength = commentsGot.length;
  }

  // lấy comments
  const comments = await driver.findElements(webdriver.By.className("_2b06"));
  let commentTxt = "";

  await Promise.all(
    comments.map(async (comment) => {
      const username = await comment
        .findElement(webdriver.By.className("_2b05"))
        .getText();
      const content = await comment
        .findElement(
          webdriver.By.css("div._2b06 div[data-sigil='comment-body']")
        )
        .getText();
      commentTxt += `${username}: ${content}\n`;
    })
  );

  await fs.promises.writeFile(`${Date.now()}.txt`, commentTxt);
  await driver.quit();
})();
