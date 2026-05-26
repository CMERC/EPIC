# -*- mode: ruby -*-
# vi: set ft=ruby :

unless Vagrant.has_plugin?("vagrant-docker-compose")
  system("vagrant plugin install vagrant-docker-compose")
  puts "Dependencies installed, please try the command again."
  exit
end

Vagrant.configure("2") do |config|
  config.vm.box = "debian/stretch64"

  port = 9090

  config.vm.network(:forwarded_port, guest: port, host: 80)
  config.vm.network(:forwarded_port, guest: 3333, host: 3333)

  config.vm.provider :virtualbox do |v|
    v.customize ["modifyvm", :id, "--memory", 4096]
  end

  config.vm.synced_folder ".", "/vagrant",
    type: "rsync",
    rsync__exclude: [
      "data/",
      "dist/",
      ".git/",
      "*node_modules/",
      ".DS_Store"
    ]
  
  config.vm.provision "app",
    type: "shell",
    keep_color: true,
    privileged: false,
    run: "always",
    inline: <<-SCRIPT
      cd /vagrant
      docker-compose up --detach
    SCRIPT

  config.vm.provision :shell, inline: "apt-get update"
  config.vm.provision :docker
  #config.vm.provision :docker_compose, env: { "PORT" => "#{port}" }, yml: "/vagrant/docker-compose.yml", rebuild: true, project_name: "epic_ready", run: "always"

  config.vm.provision :docker_compose,
    compose_version: "1.24.1"

  config.vm.provision "app",
    type: "shell",
    keep_color: true,
    privileged: false,
    run: "always",
    inline: <<-SCRIPT
      cd /vagrant
      docker-compose up --detach
    SCRIPT
end
