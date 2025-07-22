#!/usr/bin/env python3
"""
Tech Stack Detection Script v1.0
Crawl repository, emit reports/stack.json (Python, WSL-safe)
"""

import os
import json
import sys
import re
import glob
from pathlib import Path
from typing import Dict, List, Any, Optional
import argparse
from dataclasses import dataclass, asdict

@dataclass
class StackComponent:
    name: str
    version: Optional[str]
    confidence: int
    evidence: List[str]
    category: str

@dataclass
class TechStack:
    runtime: Dict[str, Any]
    webFramework: Optional[Dict[str, Any]]
    database: Optional[Dict[str, Any]]
    auth: Optional[Dict[str, Any]]
    styling: Optional[Dict[str, Any]]
    stateManagement: Optional[Dict[str, Any]]
    testing: Optional[Dict[str, Any]]
    build: Optional[Dict[str, Any]]
    deployment: Optional[Dict[str, Any]]
    monitoring: Optional[Dict[str, Any]]
    detectedComponents: List[StackComponent]
    confidence: int
    redFlags: List[Dict[str, Any]]
    recommendations: List[str]

class StackDetector:
    def __init__(self, project_path: str, agent_os_home: str = None):
        self.project_path = Path(project_path).resolve()
        self.agent_os_home = Path(agent_os_home) if agent_os_home else Path.home() / '.agent-os'
        self.detected_components = []
        self.red_flags = []
        self.recommendations = []
        
        # Load detection patterns from standards
        self.load_detection_patterns()
    
    def load_detection_patterns(self):
        """Load detection patterns from stack-identification.md"""
        patterns_file = self.agent_os_home / 'standards' / 'stack-identification.md'
        
        # Default patterns if file doesn't exist
        self.patterns = {
            'runtime': {
                'package.json': {'component': 'node', 'confidence': 90},
                'requirements.txt': {'component': 'python', 'confidence': 95},
                'pyproject.toml': {'component': 'python', 'confidence': 95},
                'go.mod': {'component': 'go', 'confidence': 98},
                'Cargo.toml': {'component': 'rust', 'confidence': 98},
                'composer.json': {'component': 'php', 'confidence': 95}
            },
            'framework_deps': {
                'next': {'component': 'next', 'confidence': 95, 'type': 'meta-framework'},
                'react': {'component': 'react', 'confidence': 90, 'type': 'library'},
                'vue': {'component': 'vue', 'confidence': 95, 'type': 'framework'},
                '@angular/core': {'component': 'angular', 'confidence': 98, 'type': 'framework'},
                'express': {'component': 'express', 'confidence': 90, 'type': 'framework'},
                'fastify': {'component': 'fastify', 'confidence': 95, 'type': 'framework'}
            },
            'database_deps': {
                'prisma': {'component': 'prisma', 'confidence': 95, 'type': 'orm'},
                '@supabase/supabase-js': {'component': 'supabase', 'confidence': 95, 'type': 'baas'},
                'mongoose': {'component': 'mongodb', 'confidence': 95, 'type': 'database'},
                'pg': {'component': 'postgresql', 'confidence': 85, 'type': 'database'},
                'mysql2': {'component': 'mysql', 'confidence': 85, 'type': 'database'},
                'redis': {'component': 'redis', 'confidence': 80, 'type': 'cache'}
            },
            'auth_deps': {
                'next-auth': {'component': 'nextauth', 'confidence': 95},
                '@auth0/nextjs-auth0': {'component': 'auth0', 'confidence': 98},
                '@supabase/auth-helpers': {'component': 'supabase-auth', 'confidence': 95},
                'passport': {'component': 'passport', 'confidence': 85},
                'jsonwebtoken': {'component': 'custom-jwt', 'confidence': 75}
            },
            'styling_deps': {
                'tailwindcss': {'component': 'tailwind', 'confidence': 98},
                'styled-components': {'component': 'styled-components', 'confidence': 95},
                '@emotion/react': {'component': 'emotion', 'confidence': 95},
                'sass': {'component': 'sass', 'confidence': 90}
            },
            'config_files': {
                'next.config.js': {'component': 'next', 'confidence': 98},
                'next.config.mjs': {'component': 'next', 'confidence': 98},
                'vite.config.js': {'component': 'vite', 'confidence': 95},
                'docker-compose.yml': {'component': 'docker', 'confidence': 98},
                'Dockerfile': {'component': 'docker', 'confidence': 95},
                'vercel.json': {'component': 'vercel', 'confidence': 98},
                'netlify.toml': {'component': 'netlify', 'confidence': 98}
            }
        }
    
    def scan_files(self) -> Dict[str, Any]:
        """Scan project files and return detected components"""
        scan_result = {
            'package_json': None,
            'config_files': [],
            'env_files': [],
            'directories': [],
            'dependencies': {},
            'dev_dependencies': {}
        }
        
        # Check for package.json
        package_json_path = self.project_path / 'package.json'
        if package_json_path.exists():
            try:
                with open(package_json_path, 'r', encoding='utf-8') as f:
                    scan_result['package_json'] = json.load(f)
                    scan_result['dependencies'] = scan_result['package_json'].get('dependencies', {})
                    scan_result['dev_dependencies'] = scan_result['package_json'].get('devDependencies', {})
            except Exception as e:
                print(f"Warning: Could not parse package.json: {e}")
        
        # Scan for configuration files
        for pattern, info in self.patterns['config_files'].items():
            config_file = self.project_path / pattern
            if config_file.exists():
                scan_result['config_files'].append({
                    'file': pattern,
                    'component': info['component'],
                    'confidence': info['confidence']
                })
        
        # Scan for environment files
        for env_file in glob.glob(str(self.project_path / '.env*')):
            scan_result['env_files'].append(Path(env_file).name)
        
        # Scan directory structure
        common_dirs = ['src', 'app', 'pages', 'components', 'lib', 'styles', 'public', 'api']
        for dir_name in common_dirs:
            dir_path = self.project_path / dir_name
            if dir_path.exists() and dir_path.is_dir():
                scan_result['directories'].append(dir_name)
        
        return scan_result
    
    def detect_runtime(self, scan_result: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Detect runtime environment"""
        runtime_info = None
        
        if scan_result['package_json']:
            pkg = scan_result['package_json']
            runtime_info = {
                'language': 'typescript' if 'typescript' in scan_result['dependencies'] or 'typescript' in scan_result['dev_dependencies'] else 'javascript',
                'version': pkg.get('engines', {}).get('node', 'unknown'),
                'environment': 'node',
                'module_type': pkg.get('type', 'commonjs'),
                'confidence': 95
            }
            
            self.detected_components.append(StackComponent(
                name='Node.js',
                version=runtime_info['version'],
                confidence=95,
                evidence=['package.json present'],
                category='runtime'
            ))
        
        # Check for other runtimes
        for file_pattern, info in self.patterns['runtime'].items():
            if (self.project_path / file_pattern).exists():
                if not runtime_info or info['confidence'] > runtime_info.get('confidence', 0):
                    runtime_info = {
                        'language': info['component'],
                        'version': 'unknown',
                        'environment': info['component'],
                        'confidence': info['confidence']
                    }
        
        return runtime_info
    
    def detect_web_framework(self, scan_result: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Detect web framework"""
        framework_info = None
        max_confidence = 0
        
        # Check dependencies
        all_deps = {**scan_result['dependencies'], **scan_result['dev_dependencies']}
        
        for dep, version in all_deps.items():
            if dep in self.patterns['framework_deps']:
                info = self.patterns['framework_deps'][dep]
                if info['confidence'] > max_confidence:
                    framework_info = {
                        'name': info['component'],
                        'version': version,
                        'type': info['type'],
                        'confidence': info['confidence']
                    }
                    max_confidence = info['confidence']
                    
                    self.detected_components.append(StackComponent(
                        name=info['component'],
                        version=version,
                        confidence=info['confidence'],
                        evidence=[f'Dependency: {dep}@{version}'],
                        category='framework'
                    ))
        
        # Check configuration files for additional confidence
        for config_file in scan_result['config_files']:
            if config_file['component'] == 'next' and framework_info and framework_info['name'] == 'next':
                framework_info['confidence'] = min(98, framework_info['confidence'] + 3)
        
        return framework_info
    
    def detect_database(self, scan_result: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Detect database and ORM"""
        database_info = None
        all_deps = {**scan_result['dependencies'], **scan_result['dev_dependencies']}
        
        detected_dbs = []
        for dep, version in all_deps.items():
            if dep in self.patterns['database_deps']:
                info = self.patterns['database_deps'][dep]
                detected_dbs.append({
                    'name': info['component'],
                    'version': version,
                    'type': info['type'],
                    'confidence': info['confidence']
                })
                
                self.detected_components.append(StackComponent(
                    name=info['component'],
                    version=version,
                    confidence=info['confidence'],
                    evidence=[f'Dependency: {dep}@{version}'],
                    category='database'
                ))
        
        if detected_dbs:
            # Find primary database and ORM
            primary_db = max((db for db in detected_dbs if db['type'] in ['database', 'baas']), 
                           key=lambda x: x['confidence'], default=None)
            orm = max((db for db in detected_dbs if db['type'] == 'orm'), 
                     key=lambda x: x['confidence'], default=None)
            
            database_info = {
                'primary': primary_db['name'] if primary_db else None,
                'orm': orm['name'] if orm else None,
                'confidence': max(db['confidence'] for db in detected_dbs)
            }
        
        return database_info
    
    def detect_auth_system(self, scan_result: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Detect authentication system"""
        auth_info = None
        all_deps = {**scan_result['dependencies'], **scan_result['dev_dependencies']}
        
        for dep, version in all_deps.items():
            if dep in self.patterns['auth_deps']:
                info = self.patterns['auth_deps'][dep]
                if not auth_info or info['confidence'] > auth_info.get('confidence', 0):
                    auth_info = {
                        'system': info['component'],
                        'version': version,
                        'confidence': info['confidence']
                    }
                    
                    self.detected_components.append(StackComponent(
                        name=info['component'],
                        version=version,
                        confidence=info['confidence'],
                        evidence=[f'Dependency: {dep}@{version}'],
                        category='auth'
                    ))
        
        return auth_info
    
    def detect_styling(self, scan_result: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Detect styling system"""
        styling_info = None
        all_deps = {**scan_result['dependencies'], **scan_result['dev_dependencies']}
        
        for dep, version in all_deps.items():
            if dep in self.patterns['styling_deps']:
                info = self.patterns['styling_deps'][dep]
                if not styling_info or info['confidence'] > styling_info.get('confidence', 0):
                    styling_info = {
                        'system': info['component'],
                        'version': version,
                        'confidence': info['confidence']
                    }
                    
                    self.detected_components.append(StackComponent(
                        name=info['component'],
                        version=version,
                        confidence=info['confidence'],
                        evidence=[f'Dependency: {dep}@{version}'],
                        category='styling'
                    ))
        
        # Check for configuration files
        config_files = ['tailwind.config.js', 'tailwind.config.ts']
        for config_file in config_files:
            if (self.project_path / config_file).exists():
                if styling_info and styling_info['system'] == 'tailwind':
                    styling_info['confidence'] = min(98, styling_info['confidence'] + 3)
                else:
                    styling_info = {
                        'system': 'tailwind',
                        'version': 'unknown',
                        'confidence': 95
                    }
        
        return styling_info
    
    def detect_testing(self, scan_result: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Detect testing frameworks"""
        testing_info = None
        all_deps = {**scan_result['dependencies'], **scan_result['dev_dependencies']}
        
        testing_frameworks = {
            'jest': {'type': 'unit', 'confidence': 90},
            'vitest': {'type': 'unit', 'confidence': 95},
            '@testing-library/react': {'type': 'integration', 'confidence': 85},
            'cypress': {'type': 'e2e', 'confidence': 95},
            'playwright': {'type': 'e2e', 'confidence': 95},
            '@playwright/test': {'type': 'e2e', 'confidence': 95}
        }
        
        detected_testing = {}
        for dep, version in all_deps.items():
            if dep in testing_frameworks:
                info = testing_frameworks[dep]
                test_type = info['type']
                if test_type not in detected_testing or info['confidence'] > detected_testing[test_type]['confidence']:
                    detected_testing[test_type] = {
                        'framework': dep,
                        'version': version,
                        'confidence': info['confidence']
                    }
                    
                    self.detected_components.append(StackComponent(
                        name=dep,
                        version=version,
                        confidence=info['confidence'],
                        evidence=[f'Dependency: {dep}@{version}'],
                        category='testing'
                    ))
        
        if detected_testing:
            testing_info = {
                'unit': detected_testing.get('unit', {}).get('framework'),
                'integration': detected_testing.get('integration', {}).get('framework'),
                'e2e': detected_testing.get('e2e', {}).get('framework'),
                'confidence': max(t['confidence'] for t in detected_testing.values())
            }
        
        return testing_info
    
    def detect_deployment(self, scan_result: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Detect deployment platform"""
        deployment_info = None
        
        # Check configuration files
        for config_file in scan_result['config_files']:
            if config_file['component'] in ['vercel', 'netlify', 'docker']:
                deployment_info = {
                    'platform': config_file['component'],
                    'type': 'serverless' if config_file['component'] in ['vercel', 'netlify'] else 'container',
                    'confidence': config_file['confidence']
                }
                
                self.detected_components.append(StackComponent(
                    name=config_file['component'],
                    version='unknown',
                    confidence=config_file['confidence'],
                    evidence=[f'Config file: {config_file["file"]}'],
                    category='deployment'
                ))
        
        return deployment_info
    
    def check_red_flags(self, scan_result: Dict[str, Any], tech_stack: TechStack):
        """Check for red flags and issues"""
        
        if scan_result['package_json']:
            pkg = scan_result['package_json']
            
            # Check for ESM/CJS mismatch with Next.js
            if (tech_stack.webFramework and tech_stack.webFramework['name'] == 'next' and
                pkg.get('type') == 'commonjs'):
                self.red_flags.append({
                    'severity': 'critical',
                    'issue': 'ESM/CJS mismatch',
                    'description': 'Next.js with CommonJS module type',
                    'solution': 'Set "type": "module" in package.json'
                })
            
            # Check Node.js version compatibility
            if tech_stack.webFramework and tech_stack.webFramework['name'] == 'next':
                engines = pkg.get('engines', {})
                node_version = engines.get('node', '')
                if node_version and not any(v in node_version for v in ['18', '20', '21']):
                    self.red_flags.append({
                        'severity': 'critical',
                        'issue': 'Node.js version incompatibility',
                        'description': f'Next.js requires Node.js 18+, found: {node_version}',
                        'solution': 'Upgrade Node.js to version 18 or higher'
                    })
            
            # Check for hardcoded secrets (basic check)
            package_str = json.dumps(pkg, indent=2)
            if re.search(r'sk_[a-zA-Z0-9_]+|pk_[a-zA-Z0-9_]+', package_str):
                self.red_flags.append({
                    'severity': 'critical',
                    'issue': 'Potential hardcoded secrets',
                    'description': 'API keys found in package.json',
                    'solution': 'Move secrets to environment variables'
                })
    
    def generate_recommendations(self, tech_stack: TechStack):
        """Generate recommendations based on detected stack"""
        
        if tech_stack.webFramework and tech_stack.webFramework['name'] == 'next':
            if not tech_stack.styling:
                self.recommendations.append('Consider adding Tailwind CSS for utility-first styling')
            
            if not tech_stack.database:
                self.recommendations.append('Consider adding Supabase for database and authentication')
            
            if not tech_stack.testing:
                self.recommendations.append('Add Jest and Testing Library for unit/integration tests')
            
            if not tech_stack.deployment:
                self.recommendations.append('Consider Vercel for optimal Next.js deployment')
        
        if tech_stack.runtime and tech_stack.runtime['language'] == 'javascript':
            self.recommendations.append('Consider migrating to TypeScript for better type safety')
        
        if not tech_stack.monitoring:
            self.recommendations.append('Add error monitoring with Sentry for production applications')
    
    def calculate_overall_confidence(self, tech_stack: TechStack) -> int:
        """Calculate overall confidence score"""
        confidences = []
        
        if tech_stack.runtime:
            confidences.append(tech_stack.runtime.get('confidence', 0))
        if tech_stack.webFramework:
            confidences.append(tech_stack.webFramework.get('confidence', 0))
        if tech_stack.database:
            confidences.append(tech_stack.database.get('confidence', 0))
        
        if not confidences:
            return 0
        
        return int(sum(confidences) / len(confidences))
    
    def detect(self) -> TechStack:
        """Main detection method"""
        print(f"Scanning project: {self.project_path}")
        
        scan_result = self.scan_files()
        
        # Detect components
        runtime = self.detect_runtime(scan_result)
        web_framework = self.detect_web_framework(scan_result)
        database = self.detect_database(scan_result)
        auth = self.detect_auth_system(scan_result)
        styling = self.detect_styling(scan_result)
        testing = self.detect_testing(scan_result)
        deployment = self.detect_deployment(scan_result)
        
        # Build tech stack
        tech_stack = TechStack(
            runtime=runtime or {},
            webFramework=web_framework,
            database=database,
            auth=auth,
            styling=styling,
            stateManagement=None,  # TODO: Implement state management detection
            testing=testing,
            build=None,  # TODO: Implement build tool detection
            deployment=deployment,
            monitoring=None,  # TODO: Implement monitoring detection
            detectedComponents=self.detected_components,
            confidence=0,  # Will be calculated
            redFlags=[],
            recommendations=[]
        )
        
        # Check for issues and generate recommendations
        self.check_red_flags(scan_result, tech_stack)
        self.generate_recommendations(tech_stack)
        
        tech_stack.redFlags = self.red_flags
        tech_stack.recommendations = self.recommendations
        tech_stack.confidence = self.calculate_overall_confidence(tech_stack)
        
        return tech_stack

def main():
    parser = argparse.ArgumentParser(description='Detect technology stack in a project')
    parser.add_argument('project_path', nargs='?', default='.', help='Path to project directory')
    parser.add_argument('--output', '-o', default='reports/stack.json', help='Output file path')
    parser.add_argument('--dry-run', action='store_true', help='Print results without saving')
    parser.add_argument('--verbose', '-v', action='store_true', help='Verbose output')
    parser.add_argument('--agent-os-home', help='Agent OS home directory')
    
    args = parser.parse_args()
    
    # Set Agent OS home
    agent_os_home = args.agent_os_home or os.environ.get('AGENT_OS_HOME', str(Path.home() / '.agent-os'))
    
    try:
        detector = StackDetector(args.project_path, agent_os_home)
        tech_stack = detector.detect()
        
        # Convert to dict for JSON serialization
        result = asdict(tech_stack)
        
        if args.verbose:
            print(f"\nDetected Tech Stack:")
            print(f"Runtime: {tech_stack.runtime}")
            print(f"Framework: {tech_stack.webFramework}")
            print(f"Database: {tech_stack.database}")
            print(f"Overall Confidence: {tech_stack.confidence}%")
            print(f"Components Found: {len(tech_stack.detectedComponents)}")
            print(f"Red Flags: {len(tech_stack.redFlags)}")
            print(f"Recommendations: {len(tech_stack.recommendations)}")
        
        if args.dry_run:
            print(json.dumps(result, indent=2))
        else:
            # Ensure output directory exists
            output_path = Path(args.output)
            output_path.parent.mkdir(parents=True, exist_ok=True)
            
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(result, f, indent=2, ensure_ascii=False)
            
            print(f"Stack detection results saved to: {output_path}")
    
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()
