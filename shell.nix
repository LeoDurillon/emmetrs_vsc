{ pkgs ? import <nixpkgs> { }, }:
pkgs.mkShell {
  packages = with pkgs; [ 
    bun 
    prettierd 
    npm-check-updates 
    nodejs_18
    rust-analyzer
    rustfmt
    rustup
    cargo
    rustc
    napi-rs-cli
    vsce
  ];

  buildInputs = [ pkgs.bashInteractive ];

  shellHook = ''
     export RUST_SRC_PATH=$(which rustc)
  '';
}
