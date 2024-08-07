package org.sonar.plugins.javascript.api;

import org.sonar.api.batch.fs.InputFile;
import org.sonar.api.batch.fs.TextRange;

public record Location(

  int startLine, int startCol, int endLine, int endCol) {

  public TextRange toTextRange(InputFile inputFile) {
    return inputFile.newRange(this.startLine, this.startCol, this.endLine, this.endCol);
  }

  @Override
  public String toString() {
    return String.format("%d:%d-%d:%d", startLine, startCol, endLine, endCol);
  }
}
