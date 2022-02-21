const webdriver = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const chromedriver = require("chromedriver");
const fs = require("fs");

(async function helloSelenium() {
  const options = new chrome.Options();
  options.setUserPreferences({
    profile: { managed_default_content_settings: { geolocation: 2 } },
  });
  options.addArguments("--disable-infobars");
  options.addArguments("--user-agent=Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1")
  const driver = new webdriver.Builder()
    .withCapabilities(webdriver.Capabilities.chrome())
    .build();

  // đăng nhập
  await driver.get("https://m.facebook.com");
  await driver
    .findElement(webdriver.By.id("m_login_email"))
    .sendKeys("tunguyenminh12369@gmail.com");
  await driver.findElement(webdriver.By.id("m_login_password")).sendKeys("220699Aa");
  await driver.findElement(webdriver.By.id("m_login_password")).submit();
  await driver.sleep(5000);
  // await driver.findElement(webdriver.By.xpath("/html/body/div[1]/div/div[2]/div[1]/div/div[2]/div/div[3]/form/div[5]/div[1]/button")).click();

  // lấy bài viết thay link
  await driver.get(
   "https://m.facebook.com/beatvn.network/photos/a.1859759174341435/3222731854710820"
  );
  await driver.sleep(7000);
  // ấn màn hình tắt thông báo
  // await driver.findElement(webdriver.By.xpath("/html/body/div[1]/div/div[3]/div[1]/div/div/div[2]/div/div/div[1]/i")).click()
  // await driver.findElement(webdriver.By.xpath("/html/body/div[5]")).click();
  await driver.sleep(2000);
  while (true) {
    await driver.sleep(2000);
    // thay xpath cần check (optional)
    const xPath =
      "//*[contains(@id, 'see_next')]";
    const loadMoreComment = await driver.findElement(webdriver.By.xpath(xPath));
    driver.executeScript("arguments[0].scrollIntoView();", loadMoreComment);
    await driver.findElement(webdriver.By.xpath(xPath)).click();
    await driver.sleep(1000);

    // check đã lấy hết comment

    if (loadMoreComment.length()){
        loadMoreComment[0].click()
      }
    else{break}
        
    // try {
    //   // thay xpath cần check (optional)
    //   const endOfComment = await driver.findElement(
    //     webdriver.By.xpath(
    //       "/html/body/div[1]/div/div[1]/div/div[3]/div/div/div[1]/div[1]/div/div[2]/div/div/div/div[1]/div[4]/div[3]"
    //     )
    //   );
    //   if (endOfComment) break;
    // } catch (e) {
    //   continue;
    // }
  }

  // lấy comments
  const comments = await driver.findElements(
    webdriver.By.xpath(
      "/html/body/div[1]/div/div[4]/div/div[1]/div/div/div/div[4]/div/div/div/div[5]/div"
    )
  );
  let commentTxt = "";
  await Promise.all(
    comments.map(async (comment) => {
      const username = await comment
        .findElement(webdriver.By.xpath("/html/body/div[1]/div/div[4]/div/div[1]/div/div/div/div[4]/div/div/div/div[5]/div[1]/div[2]/div[1]/div[1]/a"))
        .getText();
      const content = await comment
        .findElement(
          webdriver.By.xpath(
            "/html/body/div[1]/div/div[4]/div/div[1]/div/div/div/div[4]/div/div/div/div[5]/div[1]/div[2]/div[1]/div[2]"
          )
        )
        .getText();

      commentTxt += `${username}: ${content}\n`;
    })
  );
  await fs.promises.writeFile(`${Date.now()}.txt`, commentTxt);
  await driver.quit();
})();
