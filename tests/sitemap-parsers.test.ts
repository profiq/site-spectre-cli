// @ts-nocheck
import { _objToArray, _txtLinkToArray, _parseSitemap } from "../src/sitemap-parsers";
import { logger } from "../src/logger";

jest.mock("../src/logger", () => ({
  logger: {
    log: jest.fn(),
  },
}));

describe("txtLinkToArray", () => {
  describe("Test the positive scenarios", () => {
    beforeEach(() => {});

    afterEach(() => {
      global.fetch.mockClear();
    });

    it("tests correct txt sitemap input", async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          text: () =>
            Promise.resolve(
              "https://coh3stats.com/\nhttps://coh3stats.com/about\nhttps://coh3stats.com/leaderboards?race=american&type=1v1\n",
            ),
        }),
      );

      const array = await _txtLinkToArray("example.com");
      // TODO: "write a expect that it returns correctly the things"

      expect(array).toStrictEqual([
        "https://coh3stats.com/",
        "https://coh3stats.com/about",
        "https://coh3stats.com/leaderboards?race=american&type=1v1",
      ]);
      // @ts-ignore
      expect(global.fetch).toHaveBeenCalledWith("example.com");
    });
  });

  describe("Test the negative scenarios", () => {
    beforeEach(() => {});

    afterEach(() => {
      global.fetch.mockClear();
    });

    it("tests rejected url response", async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          text: () => Promise.reject("test"),
        }),
      );

      const result = await _txtLinkToArray("example.com");
      expect(result.length).toBe(0);

      expect(logger.log).toBeCalledWith(
        "error",
        "Error reading links from .txt sitemap, error: test",
      );
    });

    it("tests invalid url", async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          text: () => Promise.reject("fetch failed"),
        }),
      );

      await _txtLinkToArray("");

      expect(logger.log).toBeCalledWith(
        "error",
        "Error reading links from .txt sitemap, error: fetch failed",
      );
    });
  });
});

describe("objToArray", () => {
  describe("Test the positivie scenarios", () => {
    beforeEach(() => {
      global.fetch.mockClear();
    });

    afterEach(() => {
      global.fetch.mockClear();
    });

    it("tests correct xml sitemap with nested xml sitemaps input", async () => {
      global.fetch = jest.fn((url: string) => {
        switch (url) {
          case "https://www.profiq.com/wp-sitemap.xml": {
            return Promise.resolve({
              text: () =>
                Promise.resolve(
                  '<?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet type="text/xsl" href="https://www.profiq.com/wp-sitemap-index.xsl" ?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>https://www.profiq.com/wp-sitemap-posts-post-1.xml</loc></sitemap><sitemap><loc>https://www.profiq.com/wp-sitemap-posts-page-1.xml</loc></sitemap><sitemap><loc>https://www.profiq.com/wp-sitemap-posts-job-1.xml</loc></sitemap></sitemapindex>',
                ),
            });
          }
          case "https://www.profiq.com/wp-sitemap-posts-post-1.xml": {
            return Promise.resolve({
              text: () =>
                Promise.resolve(
                  '<?xml version="1.0" encoding="UTF-8"?>\n<?xml-stylesheet type="text/xsl" href="https://www.profiq.com/wp-sitemap.xsl" ?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://www.profiq.com/opendj-aka-opends-integration-series-of-articles/</loc></url><url><loc>https://www.profiq.com/opendj-integration-with-samba/</loc></url><url><loc>https://www.profiq.com/notes-on-opendj-integration-with-liferay/</loc></url><url><loc>https://www.profiq.com/opendj-plugin-development-based-on-example-plugin/</loc></url><url><loc>https://www.profiq.com/sowhats-independent-testing/</loc></url><url><loc>https://www.profiq.com/welcome-techies/</loc></url><url><loc>https://www.profiq.com/so-whats-independent-testing-contd/</loc></url><url><loc>https://www.profiq.com/valued-tester/</loc></url><url><loc>https://www.profiq.com/testers-illusions/</loc></url><url><loc>https://www.profiq.com/handy-test-tools-firefox-add-ons/</loc></url><url><loc>https://www.profiq.com/maven-archetype-for-opendj-plugin-development/</loc></url><url><loc>https://www.profiq.com/life-beyond-work/</loc></url><url><loc>https://www.profiq.com/how-to-test-your-opendj-plugin/</loc></url><url><loc>https://www.profiq.com/road-to-better-quality-testing-conference/</loc></url><url><loc>https://www.profiq.com/methodoligst-vs-terrorist/</loc></url><url><loc>https://www.profiq.com/tackling-complexity/</loc></url><url><loc>https://www.profiq.com/how-to-deploy-openam-with-duai/</loc></url><url><loc>https://www.profiq.com/how-to-deploy-openam-with-daui-using-ssl/</loc></url><url><loc>https://www.profiq.com/missing-the-forest-for-the-trees/</loc></url><url><loc>https://www.profiq.com/how-to-upgrade-openam/</loc></url><url><loc>https://www.profiq.com/how-to-install-and-configure-openam-web-policy-agent/</loc></url><url><loc>https://www.profiq.com/automated-installation-and-configuration-of-openam/</loc></url><url><loc>https://www.profiq.com/profiq-team-is-expanding/</loc></url><url><loc>https://www.profiq.com/using-opendj-as-publishing-directory-for-red-hat-certificate-system/</loc></url><url><loc>https://www.profiq.com/certification-based-authentication-with-openam-10-and-tomcat-7/</loc></url><url><loc>https://www.profiq.com/a-simple-openam-realm-scenario/</loc></url><url><loc>https://www.profiq.com/software-for-life/</loc></url><url><loc>https://www.profiq.com/knowing-your-subject/</loc></url><url><loc>https://www.profiq.com/openam-session-upgrade-overview/</loc></url><url><loc>https://www.profiq.com/profiq-becomes-an-istqb-accredited-training-provider/</loc></url><url><loc>https://www.profiq.com/connecting-openidm-with-microsoft-active-directory-how-to-set-it-up/</loc></url><url><loc>https://www.profiq.com/openam-session-upgrade-how-to/</loc></url><url><loc>https://www.profiq.com/openidm-using-ms-sql-as-internal-repository/</loc></url><url><loc>https://www.profiq.com/partnering-with-forgerock-to-deliver-open-identity-and-access-management-solutions/</loc></url><url><loc>https://www.profiq.com/using-oracle-db-as-openidms-repository/</loc></url><url><loc>https://www.profiq.com/setup-amazon-s3-to-liferay-with-data-migration/</loc></url><url><loc>https://www.profiq.com/introducing-liferay-and-amazon-s3/</loc></url><url><loc>https://www.profiq.com/how-to-reuse-existing-amazon-s3-structure-in-liferay/</loc></url><url><loc>https://www.profiq.com/liferay-multi-tenant-topology-using-portal-instances-with-amazon-s3/</loc></url><url><loc>https://www.profiq.com/use-cases-for-liferay-integration-with-amazon-s3/</loc></url><url><loc>https://www.profiq.com/document-versioning-in-liferay-and-amazon-s3/</loc></url><url><loc>https://www.profiq.com/how-to-run-sencha-io-examples/</loc></url><url><loc>https://www.profiq.com/openam-privileges-delegation/</loc></url><url><loc>https://www.profiq.com/how-to-run-engine-yard-local-in-centos-6-5/</loc></url><url><loc>https://www.profiq.com/how-to-run-liferay-with-enterprisedbs-ppas-as-wcm/</loc></url><url><loc>https://www.profiq.com/why-didnt-you-tell-me/</loc></url><url><loc>https://www.profiq.com/using-java-to-create-customized-virtual-machine-clones-on-vmware-infrastructure/</loc></url><url><loc>https://www.profiq.com/bringing-innovation-to-life-from-new-office-in-ostrava/</loc></url><url><loc>https://www.profiq.com/volte-in-the-news/</loc></url><url><loc>https://www.profiq.com/entering-the-valley/</loc></url><url><loc>https://www.profiq.com/choose-the-road-you-want-to-drive-in-2015/</loc></url><url><loc>https://www.profiq.com/introduction-at-karieraplus/</loc></url><url><loc>https://www.profiq.com/check-it-out/</loc></url><url><loc>https://www.profiq.com/have-a-look-at-profiq/</loc></url><url><loc>https://www.profiq.com/seafile-storage-authentication-via-forgerock-opendj/</loc></url><url><loc>https://www.profiq.com/authenticating-sencha-web-application-manager-via-forgerocks-opendj/</loc></url><url><loc>https://www.profiq.com/configure-load-balancer-for-openam-12/</loc></url><url><loc>https://www.profiq.com/wanna-a-cool-job-in-the-new-year/</loc></url><url><loc>https://www.profiq.com/gameday/</loc></url><url><loc>https://www.profiq.com/introduction-to-mulesoft/</loc></url><url><loc>https://www.profiq.com/integrating-forgerock-ldap-with-mulesoft/</loc></url><url><loc>https://www.profiq.com/be-informed-about-github-commits-via-twitter/</loc></url><url><loc>https://www.profiq.com/be-informed-about-github-commits-via-twitter-second-solution/</loc></url><url><loc>https://www.profiq.com/how-to-develop-a-mulesoft-connector/</loc></url><url><loc>https://www.profiq.com/how-we-delved-into-alternate-reality-and-why/</loc></url><url><loc>https://www.profiq.com/how-to-theme-extjs-application-in-sencha-architect-4/</loc></url><url><loc>https://www.profiq.com/kubernetes-cluster-setup-using-virtual-machines/</loc></url><url><loc>https://www.profiq.com/lifes-imprints-in-360-degrees/</loc></url><url><loc>https://www.profiq.com/we-choose-clients-who-are-on-the-same-page-as-us/</loc></url><url><loc>https://www.profiq.com/could-agile-software-companies-benefit-from-hiring-an-international-software-engineering-team-consider-the-pros-and-cons/</loc></url><url><loc>https://www.profiq.com/sencha-architect-4-tips-and-tricks/</loc></url><url><loc>https://www.profiq.com/running-automated-tests-locally-with-sencha-test-2-1-on-19-devices-simultaneously/</loc></url><url><loc>https://www.profiq.com/linkedin-post-building-trust-remotely/</loc></url><url><loc>https://www.profiq.com/videocast-the-profiq-chat-how-profiq-builds-technically-skilled-qa-teams/</loc></url><url><loc>https://www.profiq.com/videocast-the-profiq-chat-tipping-points-for-when-its-time-to-switch-from-manual-to-automated-qa-in-software-development/</loc></url><url><loc>https://www.profiq.com/what-makes-for-great-software-engineers-technical-skills-are-just-the-start/</loc></url><url><loc>https://www.profiq.com/running-extjs-app-as-a-liferay-portlet-part-1/</loc></url><url><loc>https://www.profiq.com/test-engineering-qa-why-we-often-play-with-a-software-product-until-we-break-it/</loc></url><url><loc>https://www.profiq.com/running-extjs-app-as-a-liferay-portlet-part-2/</loc></url><url><loc>https://www.profiq.com/running-extjs-code-inside-liferay-portlets/</loc></url><url><loc>https://www.profiq.com/real-time-control-of-your-app-features-with-split/</loc></url><url><loc>https://www.profiq.com/integrate-and-setup-split-io-in-under-15-minutes/</loc></url><url><loc>https://www.profiq.com/connect-all-your-iot-devices-with-yonomi/</loc></url><url><loc>https://www.profiq.com/kinetica-the-next-generation-of-gpu-databases/</loc></url><url><loc>https://www.profiq.com/creating-a-mobile-live-stream-platform-with-wowza-media-systems/</loc></url><url><loc>https://www.profiq.com/creating-coppa-compliant-apps-with-dynepic-playportal-sdk/</loc></url><url><loc>https://www.profiq.com/creating-a-data-secure-app-with-ironcore-labs/</loc></url><url><loc>https://www.profiq.com/divvypay-inc-the-1-tech-startup-to-watch-in-silicon-slopes/</loc></url><url><loc>https://www.profiq.com/how-to-safely-store-your-data-on-the-cloud/</loc></url><url><loc>https://www.profiq.com/forgerock-digital-identity-management-from-silicon-valley/</loc></url><url><loc>https://www.profiq.com/test-drive-web-scale-authentication-and-authorization-with-fusionauth/</loc></url><url><loc>https://www.profiq.com/creating-a-chatbot-based-reservation-system-with-pandorabots/</loc></url><url><loc>https://www.profiq.com/automating-foldinghome-setup-expediting-distributed-computing-research/</loc></url><url><loc>https://www.profiq.com/decoupling-policies-from-your-software-with-open-policy-agent-part-1/</loc></url><url><loc>https://www.profiq.com/decoupling-policies-from-your-software-with-open-policy-agent-part-2/</loc></url><url><loc>https://www.profiq.com/are-margaritas-the-key-to-developer-velocity-if-not-what-is/</loc></url><url><loc>https://www.profiq.com/profiqs-technical-research-team/</loc></url><url><loc>https://www.profiq.com/serial-entrepreneur-and-tech-veteran-rob-pinna-vp-of-product-and-engineering-at-serenity-app-inc-shares-5-essentials-for-development-velocity/</loc></url><url><loc>https://www.profiq.com/gaining-valuable-insights-from-complex-surveys-with-alchemer/</loc></url><url><loc>https://www.profiq.com/musical-instruments-speak-using-ai/</loc></url><url><loc>https://www.profiq.com/presto-running-sql-queries-on-anything/</loc></url><url><loc>https://www.profiq.com/our-list-of-cant-miss-movingfast-tech-podcasts/</loc></url><url><loc>https://www.profiq.com/presto-part-2-data-analysis-and-machine-learning-in-sql/</loc></url><url><loc>https://www.profiq.com/deep-learning-in-elixir-with-axon/</loc></url><url><loc>https://www.profiq.com/linux-aquarium-pc/</loc></url><url><loc>https://www.profiq.com/raspberrypi-automated-feeder/</loc></url><url><loc>https://www.profiq.com/the-first-one-serenity-changing-the-world-of-senior-care/</loc></url><url><loc>https://www.profiq.com/how-is-qas-role-changing-within-engineering-teams-hear-what-some-tech-leaders-are-thinking-about/</loc></url><url><loc>https://www.profiq.com/new-engineering-leadership-at-profiq/</loc></url><url><loc>https://www.profiq.com/whats-working-in-devops-and-the-latest-tools-and-trends-listen-in-with-martin-prokes-vp-engineering-at-profiq/</loc></url><url><loc>https://www.profiq.com/designing-rest-apis-with-stoplight/</loc></url><url><loc>https://www.profiq.com/machine-learning-in-dataiku-lets-train-an-image-classifier/</loc></url><url><loc>https://www.profiq.com/what-do-startup-tech-leaders-need-to-know-about-apis-listen-now-to-this-moving-fast-podcast-featuring-jason-harmon-cto-from-stoplight-io/</loc></url><url><loc>https://www.profiq.com/can-openai-write-programs-on-its-own/</loc></url><url><loc>https://www.profiq.com/deploying-and-scaling-elixir-apps-heroku-vs-fly-io/</loc></url><url><loc>https://www.profiq.com/docgen-enhance-your-code-with-openais-gpt-in-your-jetbrains-ide-a-cautionary-tale/</loc></url><url><loc>https://www.profiq.com/profiq-has-a-new-ceo/</loc></url><url><loc>https://www.profiq.com/empowering-users-with-advanced-question-answering-systems/</loc></url><url><loc>https://www.profiq.com/movingfast-tech-podcast-12-senior-research-manager-docker-dr-erika-noll-webb-discusses-ux-and-the-importance-of-personalizing-the-user-journey/</loc></url></urlset>\n',
                ),
            });
          }
          case "https://www.profiq.com/wp-sitemap-posts-page-1.xml": {
            return Promise.resolve({
              text: () =>
                Promise.resolve(
                  '<?xml version="1.0" encoding="UTF-8"?>\n<?xml-stylesheet type="text/xsl" href="https://www.profiq.com/wp-sitemap.xsl" ?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://www.profiq.com/blog/</loc></url><url><loc>https://www.profiq.com/about-us/</loc></url><url><loc>https://www.profiq.com/good-reasons-why-outsource-in-czech-republic/</loc></url><url><loc>https://www.profiq.com/client-testimonials/</loc></url><url><loc>https://www.profiq.com/about-this-blog/</loc></url><url><loc>https://www.profiq.com/engage/</loc></url><url><loc>https://www.profiq.com/virtual-reality/</loc></url><url><loc>https://www.profiq.com/support-vr/</loc></url><url><loc>https://www.profiq.com/</loc></url><url><loc>https://www.profiq.com/services/</loc></url><url><loc>https://www.profiq.com/careers/</loc></url><url><loc>https://www.profiq.com/your-team/</loc></url><url><loc>https://www.profiq.com/contact-us/</loc></url><url><loc>https://www.profiq.com/graduate/</loc></url><url><loc>https://www.profiq.com/cookie-policy-eu/</loc></url></urlset>\n',
                ),
            });
          }
          case "https://www.profiq.com/wp-sitemap-posts-job-1.xml": {
            return Promise.resolve({
              text: () =>
                Promise.resolve(
                  '<?xml version="1.0" encoding="UTF-8"?>\n<?xml-stylesheet type="text/xsl" href="https://www.profiq.com/wp-sitemap.xsl" ?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://www.profiq.com/job/fullstack-developer-react-node-js-ostrava/</loc></url><url><loc>https://www.profiq.com/job/backend-developer-elixir-virtual-payment-platform/</loc></url><url><loc>https://www.profiq.com/job/junior-developer/</loc></url><url><loc>https://www.profiq.com/job/junior-software-engineer-in-qa/</loc></url><url><loc>https://www.profiq.com/job/javascript-platform-developer/</loc></url></urlset>\n',
                ),
            });
          }
        }
      });

      const parsedSitemapObject = await _parseSitemap("https://www.profiq.com/wp-sitemap.xml");
      const array = await _objToArray(parsedSitemapObject);
      // TODO: "write a expect that it returns correctly the things"

      expect(array).toStrictEqual([
        "https://www.profiq.com/opendj-aka-opends-integration-series-of-articles/",
        "https://www.profiq.com/opendj-integration-with-samba/",
        "https://www.profiq.com/notes-on-opendj-integration-with-liferay/",
        "https://www.profiq.com/opendj-plugin-development-based-on-example-plugin/",
        "https://www.profiq.com/sowhats-independent-testing/",
        "https://www.profiq.com/welcome-techies/",
        "https://www.profiq.com/so-whats-independent-testing-contd/",
        "https://www.profiq.com/valued-tester/",
        "https://www.profiq.com/testers-illusions/",
        "https://www.profiq.com/handy-test-tools-firefox-add-ons/",
        "https://www.profiq.com/maven-archetype-for-opendj-plugin-development/",
        "https://www.profiq.com/life-beyond-work/",
        "https://www.profiq.com/how-to-test-your-opendj-plugin/",
        "https://www.profiq.com/road-to-better-quality-testing-conference/",
        "https://www.profiq.com/methodoligst-vs-terrorist/",
        "https://www.profiq.com/tackling-complexity/",
        "https://www.profiq.com/how-to-deploy-openam-with-duai/",
        "https://www.profiq.com/how-to-deploy-openam-with-daui-using-ssl/",
        "https://www.profiq.com/missing-the-forest-for-the-trees/",
        "https://www.profiq.com/how-to-upgrade-openam/",
        "https://www.profiq.com/how-to-install-and-configure-openam-web-policy-agent/",
        "https://www.profiq.com/automated-installation-and-configuration-of-openam/",
        "https://www.profiq.com/profiq-team-is-expanding/",
        "https://www.profiq.com/using-opendj-as-publishing-directory-for-red-hat-certificate-system/",
        "https://www.profiq.com/certification-based-authentication-with-openam-10-and-tomcat-7/",
        "https://www.profiq.com/a-simple-openam-realm-scenario/",
        "https://www.profiq.com/software-for-life/",
        "https://www.profiq.com/knowing-your-subject/",
        "https://www.profiq.com/openam-session-upgrade-overview/",
        "https://www.profiq.com/profiq-becomes-an-istqb-accredited-training-provider/",
        "https://www.profiq.com/connecting-openidm-with-microsoft-active-directory-how-to-set-it-up/",
        "https://www.profiq.com/openam-session-upgrade-how-to/",
        "https://www.profiq.com/openidm-using-ms-sql-as-internal-repository/",
        "https://www.profiq.com/partnering-with-forgerock-to-deliver-open-identity-and-access-management-solutions/",
        "https://www.profiq.com/using-oracle-db-as-openidms-repository/",
        "https://www.profiq.com/setup-amazon-s3-to-liferay-with-data-migration/",
        "https://www.profiq.com/introducing-liferay-and-amazon-s3/",
        "https://www.profiq.com/how-to-reuse-existing-amazon-s3-structure-in-liferay/",
        "https://www.profiq.com/liferay-multi-tenant-topology-using-portal-instances-with-amazon-s3/",
        "https://www.profiq.com/use-cases-for-liferay-integration-with-amazon-s3/",
        "https://www.profiq.com/document-versioning-in-liferay-and-amazon-s3/",
        "https://www.profiq.com/how-to-run-sencha-io-examples/",
        "https://www.profiq.com/openam-privileges-delegation/",
        "https://www.profiq.com/how-to-run-engine-yard-local-in-centos-6-5/",
        "https://www.profiq.com/how-to-run-liferay-with-enterprisedbs-ppas-as-wcm/",
        "https://www.profiq.com/why-didnt-you-tell-me/",
        "https://www.profiq.com/using-java-to-create-customized-virtual-machine-clones-on-vmware-infrastructure/",
        "https://www.profiq.com/bringing-innovation-to-life-from-new-office-in-ostrava/",
        "https://www.profiq.com/volte-in-the-news/",
        "https://www.profiq.com/entering-the-valley/",
        "https://www.profiq.com/choose-the-road-you-want-to-drive-in-2015/",
        "https://www.profiq.com/introduction-at-karieraplus/",
        "https://www.profiq.com/check-it-out/",
        "https://www.profiq.com/have-a-look-at-profiq/",
        "https://www.profiq.com/seafile-storage-authentication-via-forgerock-opendj/",
        "https://www.profiq.com/authenticating-sencha-web-application-manager-via-forgerocks-opendj/",
        "https://www.profiq.com/configure-load-balancer-for-openam-12/",
        "https://www.profiq.com/wanna-a-cool-job-in-the-new-year/",
        "https://www.profiq.com/gameday/",
        "https://www.profiq.com/introduction-to-mulesoft/",
        "https://www.profiq.com/integrating-forgerock-ldap-with-mulesoft/",
        "https://www.profiq.com/be-informed-about-github-commits-via-twitter/",
        "https://www.profiq.com/be-informed-about-github-commits-via-twitter-second-solution/",
        "https://www.profiq.com/how-to-develop-a-mulesoft-connector/",
        "https://www.profiq.com/how-we-delved-into-alternate-reality-and-why/",
        "https://www.profiq.com/how-to-theme-extjs-application-in-sencha-architect-4/",
        "https://www.profiq.com/kubernetes-cluster-setup-using-virtual-machines/",
        "https://www.profiq.com/lifes-imprints-in-360-degrees/",
        "https://www.profiq.com/we-choose-clients-who-are-on-the-same-page-as-us/",
        "https://www.profiq.com/could-agile-software-companies-benefit-from-hiring-an-international-software-engineering-team-consider-the-pros-and-cons/",
        "https://www.profiq.com/sencha-architect-4-tips-and-tricks/",
        "https://www.profiq.com/running-automated-tests-locally-with-sencha-test-2-1-on-19-devices-simultaneously/",
        "https://www.profiq.com/linkedin-post-building-trust-remotely/",
        "https://www.profiq.com/videocast-the-profiq-chat-how-profiq-builds-technically-skilled-qa-teams/",
        "https://www.profiq.com/videocast-the-profiq-chat-tipping-points-for-when-its-time-to-switch-from-manual-to-automated-qa-in-software-development/",
        "https://www.profiq.com/what-makes-for-great-software-engineers-technical-skills-are-just-the-start/",
        "https://www.profiq.com/running-extjs-app-as-a-liferay-portlet-part-1/",
        "https://www.profiq.com/test-engineering-qa-why-we-often-play-with-a-software-product-until-we-break-it/",
        "https://www.profiq.com/running-extjs-app-as-a-liferay-portlet-part-2/",
        "https://www.profiq.com/running-extjs-code-inside-liferay-portlets/",
        "https://www.profiq.com/real-time-control-of-your-app-features-with-split/",
        "https://www.profiq.com/integrate-and-setup-split-io-in-under-15-minutes/",
        "https://www.profiq.com/connect-all-your-iot-devices-with-yonomi/",
        "https://www.profiq.com/kinetica-the-next-generation-of-gpu-databases/",
        "https://www.profiq.com/creating-a-mobile-live-stream-platform-with-wowza-media-systems/",
        "https://www.profiq.com/creating-coppa-compliant-apps-with-dynepic-playportal-sdk/",
        "https://www.profiq.com/creating-a-data-secure-app-with-ironcore-labs/",
        "https://www.profiq.com/divvypay-inc-the-1-tech-startup-to-watch-in-silicon-slopes/",
        "https://www.profiq.com/how-to-safely-store-your-data-on-the-cloud/",
        "https://www.profiq.com/forgerock-digital-identity-management-from-silicon-valley/",
        "https://www.profiq.com/test-drive-web-scale-authentication-and-authorization-with-fusionauth/",
        "https://www.profiq.com/creating-a-chatbot-based-reservation-system-with-pandorabots/",
        "https://www.profiq.com/automating-foldinghome-setup-expediting-distributed-computing-research/",
        "https://www.profiq.com/decoupling-policies-from-your-software-with-open-policy-agent-part-1/",
        "https://www.profiq.com/decoupling-policies-from-your-software-with-open-policy-agent-part-2/",
        "https://www.profiq.com/are-margaritas-the-key-to-developer-velocity-if-not-what-is/",
        "https://www.profiq.com/profiqs-technical-research-team/",
        "https://www.profiq.com/serial-entrepreneur-and-tech-veteran-rob-pinna-vp-of-product-and-engineering-at-serenity-app-inc-shares-5-essentials-for-development-velocity/",
        "https://www.profiq.com/gaining-valuable-insights-from-complex-surveys-with-alchemer/",
        "https://www.profiq.com/musical-instruments-speak-using-ai/",
        "https://www.profiq.com/presto-running-sql-queries-on-anything/",
        "https://www.profiq.com/our-list-of-cant-miss-movingfast-tech-podcasts/",
        "https://www.profiq.com/presto-part-2-data-analysis-and-machine-learning-in-sql/",
        "https://www.profiq.com/deep-learning-in-elixir-with-axon/",
        "https://www.profiq.com/linux-aquarium-pc/",
        "https://www.profiq.com/raspberrypi-automated-feeder/",
        "https://www.profiq.com/the-first-one-serenity-changing-the-world-of-senior-care/",
        "https://www.profiq.com/how-is-qas-role-changing-within-engineering-teams-hear-what-some-tech-leaders-are-thinking-about/",
        "https://www.profiq.com/new-engineering-leadership-at-profiq/",
        "https://www.profiq.com/whats-working-in-devops-and-the-latest-tools-and-trends-listen-in-with-martin-prokes-vp-engineering-at-profiq/",
        "https://www.profiq.com/designing-rest-apis-with-stoplight/",
        "https://www.profiq.com/machine-learning-in-dataiku-lets-train-an-image-classifier/",
        "https://www.profiq.com/what-do-startup-tech-leaders-need-to-know-about-apis-listen-now-to-this-moving-fast-podcast-featuring-jason-harmon-cto-from-stoplight-io/",
        "https://www.profiq.com/can-openai-write-programs-on-its-own/",
        "https://www.profiq.com/deploying-and-scaling-elixir-apps-heroku-vs-fly-io/",
        "https://www.profiq.com/docgen-enhance-your-code-with-openais-gpt-in-your-jetbrains-ide-a-cautionary-tale/",
        "https://www.profiq.com/profiq-has-a-new-ceo/",
        "https://www.profiq.com/empowering-users-with-advanced-question-answering-systems/",
        "https://www.profiq.com/movingfast-tech-podcast-12-senior-research-manager-docker-dr-erika-noll-webb-discusses-ux-and-the-importance-of-personalizing-the-user-journey/",
        "https://www.profiq.com/blog/",
        "https://www.profiq.com/about-us/",
        "https://www.profiq.com/good-reasons-why-outsource-in-czech-republic/",
        "https://www.profiq.com/client-testimonials/",
        "https://www.profiq.com/about-this-blog/",
        "https://www.profiq.com/engage/",
        "https://www.profiq.com/virtual-reality/",
        "https://www.profiq.com/support-vr/",
        "https://www.profiq.com/",
        "https://www.profiq.com/services/",
        "https://www.profiq.com/careers/",
        "https://www.profiq.com/your-team/",
        "https://www.profiq.com/contact-us/",
        "https://www.profiq.com/graduate/",
        "https://www.profiq.com/cookie-policy-eu/",
        "https://www.profiq.com/job/fullstack-developer-react-node-js-ostrava/",
        "https://www.profiq.com/job/backend-developer-elixir-virtual-payment-platform/",
        "https://www.profiq.com/job/junior-developer/",
        "https://www.profiq.com/job/junior-software-engineer-in-qa/",
        "https://www.profiq.com/job/javascript-platform-developer/",
      ]);
      //expect(global.fetch).toHaveBeenCalledWith("whateverurl");
    });

    it("tests correct xml sitemap with final links inside", async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          text: () =>
            Promise.resolve(
              '<?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet type="text/xsl" href="https://www.profiq.com/wp-sitemap.xsl" ?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://www.profiq.com/job/fullstack-developer-react-node-js-ostrava/</loc></url><url><loc>https://www.profiq.com/job/backend-developer-elixir-virtual-payment-platform/</loc></url><url><loc>https://www.profiq.com/job/junior-developer/</loc></url><url><loc>https://www.profiq.com/job/junior-software-engineer-in-qa/</loc></url><url><loc>https://www.profiq.com/job/javascript-platform-developer/</loc></url></urlset>',
            ),
        }),
      );

      const parsedSitemapObject = await _parseSitemap("");
      const array = await _objToArray(parsedSitemapObject);

      expect(array).toStrictEqual([
        "https://www.profiq.com/job/fullstack-developer-react-node-js-ostrava/",
        "https://www.profiq.com/job/backend-developer-elixir-virtual-payment-platform/",
        "https://www.profiq.com/job/junior-developer/",
        "https://www.profiq.com/job/junior-software-engineer-in-qa/",
        "https://www.profiq.com/job/javascript-platform-developer/",
      ]);
    });
  });

  describe("Test the negative scenarios", () => {
    it("tests invalid sitemap format", async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          text: () =>
            Promise.resolve(
              '<?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet type="text/xsl" href="https://www.profiq.com/wp-sitemap.xsl" ?><xrlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://www.profiq.com/job/fullstack-developer-react-node-js-ostrava/</loc></url><url><loc>https://www.profiq.com/job/backend-developer-elixir-virtual-payment-platform/</loc></url><url><loc>https://www.profiq.com/job/junior-developer/</loc></url><url><loc>https://www.profiq.com/job/junior-software-engineer-in-qa/</loc></url><url><loc>https://www.profiq.com/job/javascript-platform-developer/</loc></url></urlset>',
            ),
        }),
      );
      const parsedSitemapObject = await _parseSitemap("");
      const array = await _objToArray(parsedSitemapObject);

      expect(logger.log).toBeCalledWith(
        "error",
        "xml doesnt have property sitemapindex or urlset (unsupported format)",
      );
    });
  });
});
/*
describe("parseSiteMap"){


          global.fetch = jest.fn((url:string) =>{
            switch(url){
              case "https://www.profiq.com/wp-sitemap.xml": {
                Promise.resolve({
                  text: () =>
                    Promise.resolve(
                      "<?xml version=\"1.0\" encoding=\"UTF-8\"?><?xml-stylesheet type=\"text/xsl\" href=\"https://www.profiq.com/wp-sitemap-index.xsl\" ?><sitemapindex xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\"><sitemap><loc>https://www.profiq.com/wp-sitemap-posts-post-1.xml</loc></sitemap><sitemap><loc>https://www.profiq.com/wp-sitemap-posts-page-1.xml</loc></sitemap><sitemap><loc>https://www.profiq.com/wp-sitemap-posts-job-1.xml</loc></sitemap></sitemapindex>",
                    )
                })
              };
              case "https://www.profiq.com/wp-sitemap-posts-post-1.xml": {
                Promise.resolve({
                  text: () =>
                    Promise.resolve(
                      "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<?xml-stylesheet type=\"text/xsl\" href=\"https://www.profiq.com/wp-sitemap.xsl\" ?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\"><url><loc>https://www.profiq.com/opendj-aka-opends-integration-series-of-articles/</loc></url><url><loc>https://www.profiq.com/opendj-integration-with-samba/</loc></url><url><loc>https://www.profiq.com/notes-on-opendj-integration-with-liferay/</loc></url><url><loc>https://www.profiq.com/opendj-plugin-development-based-on-example-plugin/</loc></url><url><loc>https://www.profiq.com/sowhats-independent-testing/</loc></url><url><loc>https://www.profiq.com/welcome-techies/</loc></url><url><loc>https://www.profiq.com/so-whats-independent-testing-contd/</loc></url><url><loc>https://www.profiq.com/valued-tester/</loc></url><url><loc>https://www.profiq.com/testers-illusions/</loc></url><url><loc>https://www.profiq.com/handy-test-tools-firefox-add-ons/</loc></url><url><loc>https://www.profiq.com/maven-archetype-for-opendj-plugin-development/</loc></url><url><loc>https://www.profiq.com/life-beyond-work/</loc></url><url><loc>https://www.profiq.com/how-to-test-your-opendj-plugin/</loc></url><url><loc>https://www.profiq.com/road-to-better-quality-testing-conference/</loc></url><url><loc>https://www.profiq.com/methodoligst-vs-terrorist/</loc></url><url><loc>https://www.profiq.com/tackling-complexity/</loc></url><url><loc>https://www.profiq.com/how-to-deploy-openam-with-duai/</loc></url><url><loc>https://www.profiq.com/how-to-deploy-openam-with-daui-using-ssl/</loc></url><url><loc>https://www.profiq.com/missing-the-forest-for-the-trees/</loc></url><url><loc>https://www.profiq.com/how-to-upgrade-openam/</loc></url><url><loc>https://www.profiq.com/how-to-install-and-configure-openam-web-policy-agent/</loc></url><url><loc>https://www.profiq.com/automated-installation-and-configuration-of-openam/</loc></url><url><loc>https://www.profiq.com/profiq-team-is-expanding/</loc></url><url><loc>https://www.profiq.com/using-opendj-as-publishing-directory-for-red-hat-certificate-system/</loc></url><url><loc>https://www.profiq.com/certification-based-authentication-with-openam-10-and-tomcat-7/</loc></url><url><loc>https://www.profiq.com/a-simple-openam-realm-scenario/</loc></url><url><loc>https://www.profiq.com/software-for-life/</loc></url><url><loc>https://www.profiq.com/knowing-your-subject/</loc></url><url><loc>https://www.profiq.com/openam-session-upgrade-overview/</loc></url><url><loc>https://www.profiq.com/profiq-becomes-an-istqb-accredited-training-provider/</loc></url><url><loc>https://www.profiq.com/connecting-openidm-with-microsoft-active-directory-how-to-set-it-up/</loc></url><url><loc>https://www.profiq.com/openam-session-upgrade-how-to/</loc></url><url><loc>https://www.profiq.com/openidm-using-ms-sql-as-internal-repository/</loc></url><url><loc>https://www.profiq.com/partnering-with-forgerock-to-deliver-open-identity-and-access-management-solutions/</loc></url><url><loc>https://www.profiq.com/using-oracle-db-as-openidms-repository/</loc></url><url><loc>https://www.profiq.com/setup-amazon-s3-to-liferay-with-data-migration/</loc></url><url><loc>https://www.profiq.com/introducing-liferay-and-amazon-s3/</loc></url><url><loc>https://www.profiq.com/how-to-reuse-existing-amazon-s3-structure-in-liferay/</loc></url><url><loc>https://www.profiq.com/liferay-multi-tenant-topology-using-portal-instances-with-amazon-s3/</loc></url><url><loc>https://www.profiq.com/use-cases-for-liferay-integration-with-amazon-s3/</loc></url><url><loc>https://www.profiq.com/document-versioning-in-liferay-and-amazon-s3/</loc></url><url><loc>https://www.profiq.com/how-to-run-sencha-io-examples/</loc></url><url><loc>https://www.profiq.com/openam-privileges-delegation/</loc></url><url><loc>https://www.profiq.com/how-to-run-engine-yard-local-in-centos-6-5/</loc></url><url><loc>https://www.profiq.com/how-to-run-liferay-with-enterprisedbs-ppas-as-wcm/</loc></url><url><loc>https://www.profiq.com/why-didnt-you-tell-me/</loc></url><url><loc>https://www.profiq.com/using-java-to-create-customized-virtual-machine-clones-on-vmware-infrastructure/</loc></url><url><loc>https://www.profiq.com/bringing-innovation-to-life-from-new-office-in-ostrava/</loc></url><url><loc>https://www.profiq.com/volte-in-the-news/</loc></url><url><loc>https://www.profiq.com/entering-the-valley/</loc></url><url><loc>https://www.profiq.com/choose-the-road-you-want-to-drive-in-2015/</loc></url><url><loc>https://www.profiq.com/introduction-at-karieraplus/</loc></url><url><loc>https://www.profiq.com/check-it-out/</loc></url><url><loc>https://www.profiq.com/have-a-look-at-profiq/</loc></url><url><loc>https://www.profiq.com/seafile-storage-authentication-via-forgerock-opendj/</loc></url><url><loc>https://www.profiq.com/authenticating-sencha-web-application-manager-via-forgerocks-opendj/</loc></url><url><loc>https://www.profiq.com/configure-load-balancer-for-openam-12/</loc></url><url><loc>https://www.profiq.com/wanna-a-cool-job-in-the-new-year/</loc></url><url><loc>https://www.profiq.com/gameday/</loc></url><url><loc>https://www.profiq.com/introduction-to-mulesoft/</loc></url><url><loc>https://www.profiq.com/integrating-forgerock-ldap-with-mulesoft/</loc></url><url><loc>https://www.profiq.com/be-informed-about-github-commits-via-twitter/</loc></url><url><loc>https://www.profiq.com/be-informed-about-github-commits-via-twitter-second-solution/</loc></url><url><loc>https://www.profiq.com/how-to-develop-a-mulesoft-connector/</loc></url><url><loc>https://www.profiq.com/how-we-delved-into-alternate-reality-and-why/</loc></url><url><loc>https://www.profiq.com/how-to-theme-extjs-application-in-sencha-architect-4/</loc></url><url><loc>https://www.profiq.com/kubernetes-cluster-setup-using-virtual-machines/</loc></url><url><loc>https://www.profiq.com/lifes-imprints-in-360-degrees/</loc></url><url><loc>https://www.profiq.com/we-choose-clients-who-are-on-the-same-page-as-us/</loc></url><url><loc>https://www.profiq.com/could-agile-software-companies-benefit-from-hiring-an-international-software-engineering-team-consider-the-pros-and-cons/</loc></url><url><loc>https://www.profiq.com/sencha-architect-4-tips-and-tricks/</loc></url><url><loc>https://www.profiq.com/running-automated-tests-locally-with-sencha-test-2-1-on-19-devices-simultaneously/</loc></url><url><loc>https://www.profiq.com/linkedin-post-building-trust-remotely/</loc></url><url><loc>https://www.profiq.com/videocast-the-profiq-chat-how-profiq-builds-technically-skilled-qa-teams/</loc></url><url><loc>https://www.profiq.com/videocast-the-profiq-chat-tipping-points-for-when-its-time-to-switch-from-manual-to-automated-qa-in-software-development/</loc></url><url><loc>https://www.profiq.com/what-makes-for-great-software-engineers-technical-skills-are-just-the-start/</loc></url><url><loc>https://www.profiq.com/running-extjs-app-as-a-liferay-portlet-part-1/</loc></url><url><loc>https://www.profiq.com/test-engineering-qa-why-we-often-play-with-a-software-product-until-we-break-it/</loc></url><url><loc>https://www.profiq.com/running-extjs-app-as-a-liferay-portlet-part-2/</loc></url><url><loc>https://www.profiq.com/running-extjs-code-inside-liferay-portlets/</loc></url><url><loc>https://www.profiq.com/real-time-control-of-your-app-features-with-split/</loc></url><url><loc>https://www.profiq.com/integrate-and-setup-split-io-in-under-15-minutes/</loc></url><url><loc>https://www.profiq.com/connect-all-your-iot-devices-with-yonomi/</loc></url><url><loc>https://www.profiq.com/kinetica-the-next-generation-of-gpu-databases/</loc></url><url><loc>https://www.profiq.com/creating-a-mobile-live-stream-platform-with-wowza-media-systems/</loc></url><url><loc>https://www.profiq.com/creating-coppa-compliant-apps-with-dynepic-playportal-sdk/</loc></url><url><loc>https://www.profiq.com/creating-a-data-secure-app-with-ironcore-labs/</loc></url><url><loc>https://www.profiq.com/divvypay-inc-the-1-tech-startup-to-watch-in-silicon-slopes/</loc></url><url><loc>https://www.profiq.com/how-to-safely-store-your-data-on-the-cloud/</loc></url><url><loc>https://www.profiq.com/forgerock-digital-identity-management-from-silicon-valley/</loc></url><url><loc>https://www.profiq.com/test-drive-web-scale-authentication-and-authorization-with-fusionauth/</loc></url><url><loc>https://www.profiq.com/creating-a-chatbot-based-reservation-system-with-pandorabots/</loc></url><url><loc>https://www.profiq.com/automating-foldinghome-setup-expediting-distributed-computing-research/</loc></url><url><loc>https://www.profiq.com/decoupling-policies-from-your-software-with-open-policy-agent-part-1/</loc></url><url><loc>https://www.profiq.com/decoupling-policies-from-your-software-with-open-policy-agent-part-2/</loc></url><url><loc>https://www.profiq.com/are-margaritas-the-key-to-developer-velocity-if-not-what-is/</loc></url><url><loc>https://www.profiq.com/profiqs-technical-research-team/</loc></url><url><loc>https://www.profiq.com/serial-entrepreneur-and-tech-veteran-rob-pinna-vp-of-product-and-engineering-at-serenity-app-inc-shares-5-essentials-for-development-velocity/</loc></url><url><loc>https://www.profiq.com/gaining-valuable-insights-from-complex-surveys-with-alchemer/</loc></url><url><loc>https://www.profiq.com/musical-instruments-speak-using-ai/</loc></url><url><loc>https://www.profiq.com/presto-running-sql-queries-on-anything/</loc></url><url><loc>https://www.profiq.com/our-list-of-cant-miss-movingfast-tech-podcasts/</loc></url><url><loc>https://www.profiq.com/presto-part-2-data-analysis-and-machine-learning-in-sql/</loc></url><url><loc>https://www.profiq.com/deep-learning-in-elixir-with-axon/</loc></url><url><loc>https://www.profiq.com/linux-aquarium-pc/</loc></url><url><loc>https://www.profiq.com/raspberrypi-automated-feeder/</loc></url><url><loc>https://www.profiq.com/the-first-one-serenity-changing-the-world-of-senior-care/</loc></url><url><loc>https://www.profiq.com/how-is-qas-role-changing-within-engineering-teams-hear-what-some-tech-leaders-are-thinking-about/</loc></url><url><loc>https://www.profiq.com/new-engineering-leadership-at-profiq/</loc></url><url><loc>https://www.profiq.com/whats-working-in-devops-and-the-latest-tools-and-trends-listen-in-with-martin-prokes-vp-engineering-at-profiq/</loc></url><url><loc>https://www.profiq.com/designing-rest-apis-with-stoplight/</loc></url><url><loc>https://www.profiq.com/machine-learning-in-dataiku-lets-train-an-image-classifier/</loc></url><url><loc>https://www.profiq.com/what-do-startup-tech-leaders-need-to-know-about-apis-listen-now-to-this-moving-fast-podcast-featuring-jason-harmon-cto-from-stoplight-io/</loc></url><url><loc>https://www.profiq.com/can-openai-write-programs-on-its-own/</loc></url><url><loc>https://www.profiq.com/deploying-and-scaling-elixir-apps-heroku-vs-fly-io/</loc></url><url><loc>https://www.profiq.com/docgen-enhance-your-code-with-openais-gpt-in-your-jetbrains-ide-a-cautionary-tale/</loc></url><url><loc>https://www.profiq.com/profiq-has-a-new-ceo/</loc></url><url><loc>https://www.profiq.com/empowering-users-with-advanced-question-answering-systems/</loc></url><url><loc>https://www.profiq.com/movingfast-tech-podcast-12-senior-research-manager-docker-dr-erika-noll-webb-discusses-ux-and-the-importance-of-personalizing-the-user-journey/</loc></url></urlset>\n",
                    )
                })
              };
              case "https://www.profiq.com/wp-sitemap-posts-page-1.xml": {
                Promise.resolve({
                  text: () =>
                    Promise.resolve(
                      "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<?xml-stylesheet type=\"text/xsl\" href=\"https://www.profiq.com/wp-sitemap.xsl\" ?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\"><url><loc>https://www.profiq.com/blog/</loc></url><url><loc>https://www.profiq.com/about-us/</loc></url><url><loc>https://www.profiq.com/good-reasons-why-outsource-in-czech-republic/</loc></url><url><loc>https://www.profiq.com/client-testimonials/</loc></url><url><loc>https://www.profiq.com/about-this-blog/</loc></url><url><loc>https://www.profiq.com/engage/</loc></url><url><loc>https://www.profiq.com/virtual-reality/</loc></url><url><loc>https://www.profiq.com/support-vr/</loc></url><url><loc>https://www.profiq.com/</loc></url><url><loc>https://www.profiq.com/services/</loc></url><url><loc>https://www.profiq.com/careers/</loc></url><url><loc>https://www.profiq.com/your-team/</loc></url><url><loc>https://www.profiq.com/contact-us/</loc></url><url><loc>https://www.profiq.com/graduate/</loc></url><url><loc>https://www.profiq.com/cookie-policy-eu/</loc></url></urlset>\n",
                    )
                })
              };
              case "https://www.profiq.com/wp-sitemap-posts-job-1.xml": {
                Promise.resolve({
                  text: () =>
                    Promise.resolve(
                      "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<?xml-stylesheet type=\"text/xsl\" href=\"https://www.profiq.com/wp-sitemap.xsl\" ?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\"><url><loc>https://www.profiq.com/job/fullstack-developer-react-node-js-ostrava/</loc></url><url><loc>https://www.profiq.com/job/backend-developer-elixir-virtual-payment-platform/</loc></url><url><loc>https://www.profiq.com/job/junior-developer/</loc></url><url><loc>https://www.profiq.com/job/junior-software-engineer-in-qa/</loc></url><url><loc>https://www.profiq.com/job/javascript-platform-developer/</loc></url></urlset>\n",
                    )
                })
              };
            }

          });

}
*/
