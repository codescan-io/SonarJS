package org.sonar.plugins.javascript.api.cache;

import java.io.IOException;
import org.sonar.api.batch.fs.InputFile;
import org.sonar.api.scanner.ScannerSide;
import org.sonarsource.api.sonarlint.SonarLintSide;


public interface CacheStrategy {

  boolean isAnalysisRequired();

  void writeAnalysisToCache(CacheAnalysis analysis, InputFile file) throws IOException;

  CacheAnalysis readAnalysisFromCache();
}
