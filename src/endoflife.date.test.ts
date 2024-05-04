import { describe, expect, test } from 'vitest'
import { CycleState, cycleState, endOfLifeDate } from './endoflife.date.ts'

describe('endoflife.data', () => {
  const eol = endOfLifeDate()

  test('all product cycles can be parsed', async () => {
    const { products } = await eol.allProducts()

    const details = products.map(p => eol.product(p))
    expect.assertions(details.length)

    // fs.writeFile('./dist/all-products.json', JSON.stringify(await Promise.all(details)), { encoding: 'utf8' }, console.error)

    details.forEach(t => {
      void expect(t).resolves.toMatchObject({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        cycles: expect.arrayContaining([expect.objectContaining({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          cycle: expect.stringMatching(/.+/),
        })]),
      })
    })
  })

  test('product cycles have an href to endoflife.date', () => {
    void expect(eol.product({ productId: 'alpine' })).resolves.toMatchObject({
      href: 'https://endoflife.date/alpine',
    })
  })

  test('all products', () => {
    expect.assertions(1)
    void expect(eol.allProducts()).resolves.toMatchInlineSnapshot(`
      {
        "products": [
          {
            "productId": "akeneo-pim",
          },
          {
            "productId": "alibaba-dragonwell",
          },
          {
            "productId": "almalinux",
          },
          {
            "productId": "alpine",
          },
          {
            "productId": "amazon-cdk",
          },
          {
            "productId": "amazon-corretto",
          },
          {
            "productId": "amazon-eks",
          },
          {
            "productId": "amazon-glue",
          },
          {
            "productId": "amazon-linux",
          },
          {
            "productId": "amazon-neptune",
          },
          {
            "productId": "amazon-rds-mysql",
          },
          {
            "productId": "amazon-rds-postgresql",
          },
          {
            "productId": "android",
          },
          {
            "productId": "angular",
          },
          {
            "productId": "angularjs",
          },
          {
            "productId": "ansible",
          },
          {
            "productId": "ansible-core",
          },
          {
            "productId": "antix",
          },
          {
            "productId": "apache",
          },
          {
            "productId": "apache-activemq",
          },
          {
            "productId": "apache-airflow",
          },
          {
            "productId": "apache-camel",
          },
          {
            "productId": "apache-cassandra",
          },
          {
            "productId": "apache-groovy",
          },
          {
            "productId": "apache-hadoop",
          },
          {
            "productId": "apache-hop",
          },
          {
            "productId": "apache-kafka",
          },
          {
            "productId": "apache-spark",
          },
          {
            "productId": "apache-struts",
          },
          {
            "productId": "api-platform",
          },
          {
            "productId": "apple-watch",
          },
          {
            "productId": "arangodb",
          },
          {
            "productId": "argo-cd",
          },
          {
            "productId": "artifactory",
          },
          {
            "productId": "aws-lambda",
          },
          {
            "productId": "azul-zulu",
          },
          {
            "productId": "azure-devops-server",
          },
          {
            "productId": "azure-kubernetes-service",
          },
          {
            "productId": "bazel",
          },
          {
            "productId": "beats",
          },
          {
            "productId": "bellsoft-liberica",
          },
          {
            "productId": "blender",
          },
          {
            "productId": "bootstrap",
          },
          {
            "productId": "bun",
          },
          {
            "productId": "cakephp",
          },
          {
            "productId": "centos",
          },
          {
            "productId": "centos-stream",
          },
          {
            "productId": "centreon",
          },
          {
            "productId": "cert-manager",
          },
          {
            "productId": "cfengine",
          },
          {
            "productId": "chef-infra-server",
          },
          {
            "productId": "citrix-vad",
          },
          {
            "productId": "ckeditor",
          },
          {
            "productId": "clamav",
          },
          {
            "productId": "cockroachdb",
          },
          {
            "productId": "coldfusion",
          },
          {
            "productId": "composer",
          },
          {
            "productId": "confluence",
          },
          {
            "productId": "consul",
          },
          {
            "productId": "containerd",
          },
          {
            "productId": "contao",
          },
          {
            "productId": "cortex-xdr",
          },
          {
            "productId": "cos",
          },
          {
            "productId": "couchbase-server",
          },
          {
            "productId": "craft-cms",
          },
          {
            "productId": "dbt-core",
          },
          {
            "productId": "debian",
          },
          {
            "productId": "dependency-track",
          },
          {
            "productId": "devuan",
          },
          {
            "productId": "django",
          },
          {
            "productId": "docker-engine",
          },
          {
            "productId": "dotnet",
          },
          {
            "productId": "dotnetfx",
          },
          {
            "productId": "drupal",
          },
          {
            "productId": "drush",
          },
          {
            "productId": "eclipse-jetty",
          },
          {
            "productId": "eclipse-temurin",
          },
          {
            "productId": "elasticsearch",
          },
          {
            "productId": "electron",
          },
          {
            "productId": "elixir",
          },
          {
            "productId": "emberjs",
          },
          {
            "productId": "envoy",
          },
          {
            "productId": "erlang",
          },
          {
            "productId": "esxi",
          },
          {
            "productId": "etcd",
          },
          {
            "productId": "eurolinux",
          },
          {
            "productId": "exim",
          },
          {
            "productId": "fairphone",
          },
          {
            "productId": "fedora",
          },
          {
            "productId": "ffmpeg",
          },
          {
            "productId": "filemaker",
          },
          {
            "productId": "firefox",
          },
          {
            "productId": "fluent-bit",
          },
          {
            "productId": "flux",
          },
          {
            "productId": "fortios",
          },
          {
            "productId": "freebsd",
          },
          {
            "productId": "gerrit",
          },
          {
            "productId": "gitlab",
          },
          {
            "productId": "go",
          },
          {
            "productId": "goaccess",
          },
          {
            "productId": "godot",
          },
          {
            "productId": "google-kubernetes-engine",
          },
          {
            "productId": "google-nexus",
          },
          {
            "productId": "gorilla",
          },
          {
            "productId": "graalvm",
          },
          {
            "productId": "gradle",
          },
          {
            "productId": "grafana",
          },
          {
            "productId": "grails",
          },
          {
            "productId": "graylog",
          },
          {
            "productId": "gstreamer",
          },
          {
            "productId": "haproxy",
          },
          {
            "productId": "hashicorp-vault",
          },
          {
            "productId": "hbase",
          },
          {
            "productId": "horizon",
          },
          {
            "productId": "ibm-aix",
          },
          {
            "productId": "ibm-i",
          },
          {
            "productId": "ibm-semeru-runtime",
          },
          {
            "productId": "icinga-web",
          },
          {
            "productId": "intel-processors",
          },
          {
            "productId": "internet-explorer",
          },
          {
            "productId": "ionic",
          },
          {
            "productId": "ios",
          },
          {
            "productId": "ipad",
          },
          {
            "productId": "ipados",
          },
          {
            "productId": "iphone",
          },
          {
            "productId": "isc-dhcp",
          },
          {
            "productId": "istio",
          },
          {
            "productId": "jekyll",
          },
          {
            "productId": "jenkins",
          },
          {
            "productId": "jhipster",
          },
          {
            "productId": "jira-software",
          },
          {
            "productId": "joomla",
          },
          {
            "productId": "jquery",
          },
          {
            "productId": "jreleaser",
          },
          {
            "productId": "kde-plasma",
          },
          {
            "productId": "keda",
          },
          {
            "productId": "keycloak",
          },
          {
            "productId": "kibana",
          },
          {
            "productId": "kindle",
          },
          {
            "productId": "kirby",
          },
          {
            "productId": "kong-gateway",
          },
          {
            "productId": "kotlin",
          },
          {
            "productId": "kubernetes",
          },
          {
            "productId": "kubernetes-csi-node-driver-registrar",
          },
          {
            "productId": "laravel",
          },
          {
            "productId": "libreoffice",
          },
          {
            "productId": "lineageos",
          },
          {
            "productId": "linux",
          },
          {
            "productId": "linuxmint",
          },
          {
            "productId": "log4j",
          },
          {
            "productId": "logstash",
          },
          {
            "productId": "looker",
          },
          {
            "productId": "lua",
          },
          {
            "productId": "macos",
          },
          {
            "productId": "mageia",
          },
          {
            "productId": "magento",
          },
          {
            "productId": "mariadb",
          },
          {
            "productId": "mastodon",
          },
          {
            "productId": "matomo",
          },
          {
            "productId": "mattermost",
          },
          {
            "productId": "maven",
          },
          {
            "productId": "mediawiki",
          },
          {
            "productId": "meilisearch",
          },
          {
            "productId": "memcached",
          },
          {
            "productId": "micronaut",
          },
          {
            "productId": "microsoft-build-of-openjdk",
          },
          {
            "productId": "mongodb",
          },
          {
            "productId": "moodle",
          },
          {
            "productId": "motorola-mobility",
          },
          {
            "productId": "msexchange",
          },
          {
            "productId": "mssqlserver",
          },
          {
            "productId": "mulesoft-runtime",
          },
          {
            "productId": "mxlinux",
          },
          {
            "productId": "mysql",
          },
          {
            "productId": "neo4j",
          },
          {
            "productId": "netbsd",
          },
          {
            "productId": "nextcloud",
          },
          {
            "productId": "nextjs",
          },
          {
            "productId": "nexus",
          },
          {
            "productId": "nginx",
          },
          {
            "productId": "nix",
          },
          {
            "productId": "nixos",
          },
          {
            "productId": "nodejs",
          },
          {
            "productId": "nokia",
          },
          {
            "productId": "nomad",
          },
          {
            "productId": "numpy",
          },
          {
            "productId": "nutanix-aos",
          },
          {
            "productId": "nutanix-files",
          },
          {
            "productId": "nutanix-prism",
          },
          {
            "productId": "nuxt",
          },
          {
            "productId": "nvidia",
          },
          {
            "productId": "nvidia-gpu",
          },
          {
            "productId": "office",
          },
          {
            "productId": "openbsd",
          },
          {
            "productId": "openjdk-builds-from-oracle",
          },
          {
            "productId": "opensearch",
          },
          {
            "productId": "openssl",
          },
          {
            "productId": "opensuse",
          },
          {
            "productId": "opentofu",
          },
          {
            "productId": "openwrt",
          },
          {
            "productId": "openzfs",
          },
          {
            "productId": "opnsense",
          },
          {
            "productId": "oracle-apex",
          },
          {
            "productId": "oracle-database",
          },
          {
            "productId": "oracle-jdk",
          },
          {
            "productId": "oracle-linux",
          },
          {
            "productId": "oracle-solaris",
          },
          {
            "productId": "ovirt",
          },
          {
            "productId": "pangp",
          },
          {
            "productId": "panos",
          },
          {
            "productId": "pci-dss",
          },
          {
            "productId": "perl",
          },
          {
            "productId": "photon",
          },
          {
            "productId": "php",
          },
          {
            "productId": "phpbb",
          },
          {
            "productId": "phpmyadmin",
          },
          {
            "productId": "pixel",
          },
          {
            "productId": "plesk",
          },
          {
            "productId": "pop-os",
          },
          {
            "productId": "postfix",
          },
          {
            "productId": "postgresql",
          },
          {
            "productId": "postmarketos",
          },
          {
            "productId": "powershell",
          },
          {
            "productId": "prometheus",
          },
          {
            "productId": "protractor",
          },
          {
            "productId": "proxmox-ve",
          },
          {
            "productId": "puppet",
          },
          {
            "productId": "python",
          },
          {
            "productId": "qt",
          },
          {
            "productId": "quarkus-framework",
          },
          {
            "productId": "quasar",
          },
          {
            "productId": "rabbitmq",
          },
          {
            "productId": "rails",
          },
          {
            "productId": "rancher",
          },
          {
            "productId": "raspberry-pi",
          },
          {
            "productId": "react",
          },
          {
            "productId": "readynas",
          },
          {
            "productId": "red-hat-openshift",
          },
          {
            "productId": "redhat-build-of-openjdk",
          },
          {
            "productId": "redhat-jboss-eap",
          },
          {
            "productId": "redhat-satellite",
          },
          {
            "productId": "redis",
          },
          {
            "productId": "redmine",
          },
          {
            "productId": "rhel",
          },
          {
            "productId": "robo",
          },
          {
            "productId": "rocket-chat",
          },
          {
            "productId": "rocky-linux",
          },
          {
            "productId": "ros",
          },
          {
            "productId": "ros-2",
          },
          {
            "productId": "roundcube",
          },
          {
            "productId": "ruby",
          },
          {
            "productId": "rust",
          },
          {
            "productId": "salt",
          },
          {
            "productId": "samsung-mobile",
          },
          {
            "productId": "sapmachine",
          },
          {
            "productId": "scala",
          },
          {
            "productId": "sharepoint",
          },
          {
            "productId": "shopware",
          },
          {
            "productId": "silverstripe",
          },
          {
            "productId": "slackware",
          },
          {
            "productId": "sles",
          },
          {
            "productId": "solr",
          },
          {
            "productId": "sonar",
          },
          {
            "productId": "sourcegraph",
          },
          {
            "productId": "splunk",
          },
          {
            "productId": "spring-boot",
          },
          {
            "productId": "spring-framework",
          },
          {
            "productId": "sqlite",
          },
          {
            "productId": "squid",
          },
          {
            "productId": "steamos",
          },
          {
            "productId": "surface",
          },
          {
            "productId": "symfony",
          },
          {
            "productId": "tails",
          },
          {
            "productId": "tarantool",
          },
          {
            "productId": "telegraf",
          },
          {
            "productId": "terraform",
          },
          {
            "productId": "tomcat",
          },
          {
            "productId": "traefik",
          },
          {
            "productId": "twig",
          },
          {
            "productId": "typo3",
          },
          {
            "productId": "ubuntu",
          },
          {
            "productId": "umbraco",
          },
          {
            "productId": "unity",
          },
          {
            "productId": "unrealircd",
          },
          {
            "productId": "varnish",
          },
          {
            "productId": "vcenter",
          },
          {
            "productId": "veeam-backup-and-replication",
          },
          {
            "productId": "visual-cobol",
          },
          {
            "productId": "visual-studio",
          },
          {
            "productId": "vmware-cloud-foundation",
          },
          {
            "productId": "vmware-harbor-registry",
          },
          {
            "productId": "vmware-srm",
          },
          {
            "productId": "vue",
          },
          {
            "productId": "vuetify",
          },
          {
            "productId": "wagtail",
          },
          {
            "productId": "watchos",
          },
          {
            "productId": "weechat",
          },
          {
            "productId": "windows",
          },
          {
            "productId": "windows-embedded",
          },
          {
            "productId": "windows-server",
          },
          {
            "productId": "wordpress",
          },
          {
            "productId": "xcp-ng",
          },
          {
            "productId": "yarn",
          },
          {
            "productId": "yocto",
          },
          {
            "productId": "zabbix",
          },
          {
            "productId": "zerto",
          },
          {
            "productId": "zookeeper",
          },
        ],
      }
    `)
  })
})

describe('cycle-state', () => {
  const now = new Date('2024-03-15T13:08:32Z')
  const futureDate = new Date('2024-10-01')
  const furtherFutureDate = new Date('2025-01-01')
  const earlierDate = new Date('2024-01-01')
  const evenEarlierDate = new Date('2023-09-18')

  test.each([
    {
      cycle: { cycle: '1', eol: false },
      expectedState: { state: 'active-support' } satisfies CycleState,
    },
    {
      cycle: { cycle: '2', eol: false, support: true },
      expectedState: { state: 'active-support' } satisfies CycleState,
    },
    {
      cycle: { cycle: '3', eol: futureDate },
      expectedState: { state: 'active-support', endDate: futureDate } satisfies CycleState,
    },
    {
      cycle: { cycle: '4', eol: futureDate, support: true },
      expectedState: { state: 'active-support', endDate: futureDate } satisfies CycleState,
    },
    {
      cycle: { cycle: '5', eol: furtherFutureDate, support: futureDate },
      expectedState: {
        state: 'active-support',
        endDate: futureDate,
        securityEndDate: furtherFutureDate,
      } satisfies CycleState,
    },
  ])('active-support; %j', ({ cycle, expectedState }) => {
    expect(cycleState(cycle)(now)).toMatchObject(expectedState)
  })

  test.each([
    {
      cycle: { cycle: '1', eol: false, support: false },
      expectedState: { state: 'extended-support' } satisfies CycleState,
    },
    {
      cycle: { cycle: '2', eol: false, support: earlierDate },
      expectedState: { state: 'extended-support', endDate: earlierDate } satisfies CycleState,
    },
    {
      cycle: { cycle: '3', eol: futureDate, support: false },
      expectedState: { state: 'extended-support', endDate: futureDate } satisfies CycleState,
    },
    {
      cycle: { cycle: '4', eol: futureDate, support: earlierDate },
      expectedState: { state: 'extended-support', endDate: futureDate } satisfies CycleState,
    },
  ])('extended-support; %j', ({ cycle, expectedState }) => {
    expect(cycleState(cycle)(now)).toMatchObject(expectedState)
  })

  test.each([
    {
      cycle: { cycle: '1', eol: false, lts: true },
      expectedState: { state: 'active-support', isLts: true } satisfies CycleState,
    },
    {
      cycle: { cycle: '2', eol: false, lts: false },
      expectedState: { state: 'active-support', isLts: false } satisfies CycleState,
    },
    {
      cycle: { cycle: '3', eol: false },
      expectedState: { state: 'active-support', isLts: undefined } satisfies CycleState,
    },
    {
      cycle: { cycle: '4', eol: furtherFutureDate, lts: futureDate },
      expectedState: { state: 'active-support', isLts: false } satisfies CycleState,
    },
    {
      cycle: { cycle: '5', eol: futureDate, lts: earlierDate },
      expectedState: { state: 'active-support', isLts: true } satisfies CycleState,
    },
    {
      cycle: { cycle: '6', eol: false, support: false, lts: true },
      expectedState: { state: 'extended-support', isLts: true } satisfies CycleState,
    },
    {
      cycle: { cycle: '7', eol: false, support: false, lts: false },
      expectedState: { state: 'extended-support', isLts: false } satisfies CycleState,
    },
    {
      cycle: { cycle: '8', eol: false, support: false },
      expectedState: { state: 'extended-support', isLts: undefined } satisfies CycleState,
    },
  ])('is LTS; %j', ({ cycle, expectedState }) => {
    expect(cycleState(cycle)(now)).toMatchObject(expectedState)
  })

  test.each([
    {
      cycle: { cycle: '1', eol: false, discontinued: true },
      expectedState: { state: 'discontinued' } satisfies CycleState,
    },
    {
      cycle: { cycle: '2', eol: false, discontinued: earlierDate },
      expectedState: { state: 'discontinued', onDate: earlierDate } satisfies CycleState,
    },
    {
      cycle: { cycle: '3', eol: futureDate, discontinued: true },
      expectedState: { state: 'discontinued', supportEndDate: futureDate } satisfies CycleState,
    },
    {
      cycle: { cycle: '4', eol: futureDate, discontinued: earlierDate },
      expectedState: { state: 'discontinued', onDate: earlierDate, supportEndDate: futureDate } satisfies CycleState,
    },
  ])('discontinued; %j', ({ cycle, expectedState }) => {
    expect(cycleState(cycle)(now)).toEqual(expectedState)
  })

  test.each([
    {
      cycle: { cycle: '1', eol: true },
      expectedState: { state: 'unsupported' } satisfies CycleState,
    },
    {
      cycle: { cycle: '2', eol: true, support: false },
      expectedState: { state: 'unsupported' } satisfies CycleState,
    },
    {
      cycle: { cycle: '3', eol: true, support: earlierDate },
      expectedState: { state: 'unsupported', supportEndDate: earlierDate } satisfies CycleState,
    },
    {
      cycle: { cycle: '4', eol: true, discontinued: true },
      expectedState: { state: 'unsupported' } satisfies CycleState,
    },
    {
      cycle: { cycle: '5', eol: true, discontinued: earlierDate },
      expectedState: { state: 'unsupported' } satisfies CycleState,
    },
    {
      cycle: { cycle: '6', eol: new Date('2024-01-01') },
      expectedState: { state: 'unsupported', supportEndDate: earlierDate } satisfies CycleState,
    },
    {
      cycle: { cycle: '6', eol: earlierDate, support: evenEarlierDate },
      expectedState: { state: 'unsupported', supportEndDate: earlierDate } satisfies CycleState,
    },
  ])('unsupported; %j', ({ cycle, expectedState }) => {
    expect(cycleState(cycle)(now)).toEqual(expectedState)
  })
})
